import React from 'react'
import { useEffect, useState, useContext, useCallback } from "react";
import { UserContext } from "../context/UserContext";
import {
  Heading,
  Notification,
} from "react-bulma-components";

function HomePage() {

  const [error, setError] = useState("");
  const [posts, setPosts] = useState([])
  const [userContext, setUserContext] = useContext(UserContext);
  // const [comment, setComment] = useContext("")

  const fetchPosts = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "api/user/getPosts", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts)
      }
      else {
        setError("Error fetching data")
      }
    });
  }, [posts])

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, [fetchPosts, posts]);

  const submitLike = () => {

  }

  const deletePost = () => {


  }

  const addComment = () => {

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
                      <img src={`/images/${post.imageUrl}.jpg`}
                        alt={post.title} width="100px" />
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="is-flex mb-1">
                      <div className="pr-2">
                        <input type="hidden" name="postId" value={post._id} />
                        <button type="submit"
                          className="buttons-like-commit button is-ghost p-0 "
                          onClick={submitLike}
                        >
                          <i className="far fa-thumbs-up p-8"></i>
                        </button>
                      </div>
                      <div className="pl-2" >
                        <span className="p-8  ">
                          <a className="buttons-like-commit" href={`/posts/${post._id}?autofocus=true`}> <i className="far fa-comments"></i></a>
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
                    <a className="card-footer-item color-secondary" href={`/posts/${post._id}`}>Details</a>

                    {userContext.details && (
                      <>
                        <a className="card-footer-item color-secondary"
                          href="/admin/edit-post/<%= post._id %>?edit=true">Edit</a>
                        <a className="card-footer-item color-secondary" href="#"
                          onClick={deletePost}>Delete</a>
                      </>)}
                  </footer>
                  <footer className="card-footer">
                    <input className="input is-small is-static py-4 px-5" type="text" name="comment" placeholder="Add a comment..." />
                    <button className="button is-ghost color-secondary" onClick={addComment}>Post</button>
                  </footer>
                </div>
              </div>
            )

          })}
        </div>
      ) : (
        <Notification>
          <Heading>No Posts Found!</Heading>
          Click <a href="/login">here</a> to go to Login page and create a Post
        </Notification>
      )
      }


    </main>
  )
}

export default HomePage