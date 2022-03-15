import React from 'react'
import { useEffect, useState, useContext, useCallback } from "react";
import { UserContext } from "../../context/UserContext";
import {
  Heading,
  Notification,
} from "react-bulma-components";

import { Link } from 'react-router-dom'

import "./HomePage.css"

function HomePage() {

  const [error, setError] = useState("");
  const [posts, setPosts] = useState([])
  const { fetchData, setFetchData } = useState(true)
  const [userContext, setUserContext] = useContext(UserContext);
  const [loading, setLoading] = useState(false)

  // const [comment, setComment] = useContext("")

  const fetchPosts = useCallback(() => {
    setLoading(true);
    fetch(process.env.REACT_APP_API_ENDPOINT + "api/user/getPosts", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
        setFetchData(false);
      }
      else {
        setError("Error fetching data")
      }
      setLoading(false);
    }).catch(err => { setLoading(false) });
  }, [setFetchData])

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, [posts.length, fetchPosts]);

  const submitLike = (event) => {
    const postId = event.target.postId.value;
    fetch(process.env.REACT_APP_API_ENDPOINT + "api/admin/like-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
      body: JSON.stringify({ postId }),
      credentials: "include",

    }).then(async (response) => {
      if (response.ok) {
        await response.json;
        setFetchData(true);
      }
      else {
        setError("Error liking a post")
      }
    })

  }

  const deletePost = (event) => {
    const postId = event.target.postId.value;
    fetch(process.env.REACT_APP_API_ENDPOINT + "api/admin/deletePost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
      body: JSON.stringify({ postId }),
      credentials: "include",

    }).then(async (response) => {
      if (response.ok) {
        await response.json;
        setFetchData(true);
      }
      else {
        setError("Error deleting post")
      }
    })


  }

  const addComment = (event) => {
    const comment = event.target.comment.value;
    const postId = event.target.postId.value;
    fetch(process.env.REACT_APP_API_ENDPOINT + "api/admin/add-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
      body: JSON.stringify({ postId, comment }),
      credentials: "include",

    }).then(async (response) => {
      if (response.ok) {
        await response.json;
      }
      else {
        setError("Error you should be logged for comment a post")
      }
    })

  }
  if (loading) {
    return (
      <Notification>
        <Heading>Loading...</Heading>
      </Notification>
    )
  }
  return (
    <main>
      {error && <div className="notification is-warning is-light p-2">
        {error}
      </div>}
      {posts.length > 0 ? (
        <div className="columns is-multiline is-4 m-4">
          
          {posts && posts.map((post) => {
            return (
              <div className="column is-one-quarter" key={post.id}>
                <div className="card">
                  <div className="card-image">
                    <figure className="image is-4by3">
                      <img src={`/images/${post.imageUrl}.${process.env.REACT_APP_API_FORMAT_IMAGES}`}
                        alt={post.title} width="100px" />
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="is-flex mb-1">
                      <div className="pr-2">
                        <form onSubmit={submitLike}>
                          <input type="hidden" name="postId" value={post._id} />
                          <button type="submit"
                            className="buttons-like-commit button is-ghost p-0 "
                          >
                            <i className="far fa-thumbs-up p-8"></i>
                          </button>
                        </form>

                      </div>
                      <div className="pl-2" >
                        <span className="p-8  ">
                          <a className="buttons-like-commit" href={`/postDetails/${post._id}?autofocus=true`}> <i className="far fa-comments"></i></a>
                        </span>
                      </div>
                    </div>
                    <div className="has-text-weight-bold mb-3">
                      {post.likes === 0 ? ("Be the first to like this") : (`${post.likes} likes`)}
                    </div>
                    <div className="media">
                      <div className="media-left">
                        <div className="media-content">
                          <p className="title is-4 is-capitalized">
                            {post.title}
                          </p>
                          <p className="subtitle is-6">@{post.username}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="content">
                      {post.description.length >= 25 ? (post.description.slice(0, 25).concat('...')) : (post.description)}
                    </div>
                  </div>
                  <footer className="card-footer">
                    <a className="card-footer-item color-secondary" href={`/postDetails/${post._id}`}>
                    <button className='button is-ghost has-text-info decNone'>Details</button>
                      </a>

                    {(userContext.details && ((userContext.details.username ===post.username)|| (userContext.details.username === "admin"))) && (
                      <>
                        <Link className='card-footer-item color-secondary' to={`/admin/add-post/${post._id}?edit=true`}>Edit</Link>
                        <form className='formDeletePost' onSubmit={deletePost}>
                          <input type="hidden" name="postId" value={post._id} />
                          <a className="card-footer-item color-secondary" href="">
                            <button className='button is-ghost has-text-info decNone' type="submit">Delete</button>
                          </a>
                        </form>

                      </>)}
                  </footer>
                  <footer className="card-footer">
                    <form className='is-flex card-footer-item py-1 px-2' onSubmit={addComment}>
                      <input type="hidden" name="postId" value={post._id} />
                      <input className="input is-small is-static" type="text" name="comment" placeholder="Add a comment..." />
                      <button className="button is-ghost color-secondary" type='submit'>Post</button>
                    </form>

                  </footer>
                </div>
              </div>
            )

          })}
        </div>
      ) : (
        <div className=" container widthNotification has-background-light mt-6">
          <Notification>
            <Heading>No Posts Found!</Heading>
            {userContext.details ?
              (<h1 className='subtitle mt-2'>Click < a href="/admin/add-post">here</a> to create a Post</h1>) :
              (<h1 className='subtitle'>Click < a href="/login">here</a> to go to Login page</h1>)
            }

          </Notification>
        </div>

      )
      }


    </main >
  )
}

export default HomePage