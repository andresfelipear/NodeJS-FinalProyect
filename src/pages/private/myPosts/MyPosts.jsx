import React from 'react'
import { useEffect, useState, useContext, useCallback } from "react";
import { UserContext } from "../../../context/UserContext"
import {
  Heading,
  Notification,
} from "react-bulma-components";

import { Link } from 'react-router-dom'
import ModalDelete from '../../../components/ModalDelete/ModalDelete';

import "./MyPosts.css"
import Modal from '../../../components/notification/Modal';

function MyPosts() {

  const [error, setError] = useState("");
  const [posts, setPosts] = useState([])
  const [userContext, setUserContext] = useContext(UserContext);
  const [loading, setLoading] = useState(false)
  const [notiTitle, setNotiTitle] = useState("")
  const [notiBody, setNotiBody] = useState("")
  const [notiDeleteTitle, setNotiDeleteTitle] = useState("")
  const [notiDeleteBody, setNotiDeleteBody] = useState("")
  const [postIdDelete, setPostIdDelete] = useState("")


  const openModal = (title, message) => {
    const modalContainer = document.getElementById("modal-container");
    modalContainer.classList.add("is-active");
    setNotiTitle(title);
    setNotiBody(message);
  }
  //modal confirmation delete post
  const openModal2 = (postId) => {
    setPostIdDelete(postId)
    const modalContainer = document.getElementById("modal-container2");
    modalContainer.classList.add("is-active");
    setNotiDeleteTitle("Remove Post");
    setNotiDeleteBody("Are you sure you want to delete this post?");
  }

  const closeModal = () => {
    const modalContainer = document.getElementById("modal-container");
    modalContainer.classList.remove("is-active");
  }

  const closeModal2 = () => {
    const modalContainer = document.getElementById("modal-container2");
    modalContainer.classList.remove("is-active");
    setPostIdDelete("")
  }

  const processDelete = (e) => {
    const confirmation = e.target.value
    if (confirmation === "Yes") {
      deletePost()
    }
    closeModal2()
  }

  const fetchPosts = useCallback(() => {
    setLoading(true);
    fetch(process.env.REACT_APP_API_ENDPOINT + "/api/user/getPosts", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        if (userContext.details) {
          setPosts(data.posts.filter(post => post.username === userContext.details.username))
        }
      }
      else {
        setError("Error fetching data")
      }
      setLoading(false);
    }).catch(err => { console.log(err); setLoading(false) });
  }, [userContext.details])


  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, [posts, fetchPosts]);

  const submitLike = (event) => {
    const postId = event.target.postId.value;
    fetch(process.env.REACT_APP_API_ENDPOINT + "/api/admin/like-post", {
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
      }
      else {
        setError("Error liking a post")
      }
    })

  }

  const deletePost = () => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "/api/admin/deletePost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
      body: JSON.stringify({ postId: postIdDelete }),
      credentials: "include",

    }).then(async (response) => {
      if (response.ok) {
        await response.json;
        setPosts([])
      }
      else {
        openModal("Delete Error", "Error deleting post")
      }
    })


  }

  const addComment = (event) => {
    const comment = event.target.comment.value;
    const postId = event.target.postId.value;
    fetch(process.env.REACT_APP_API_ENDPOINT + "/api/admin/add-comment", {
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
      {
        posts.length > 0 ? (
          <>
            {userContext.details && (
              <div className="columns is-multiline is-4 m-4">
                {posts && posts.map((post) => {
                  return (
                    <div className="column is-one-quarter" key={post._id}>
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
                          <a className="card-footer-item color-secondary" href={`/postDetails/${post._id}`}>Details</a>
                          <>
                            <Link className='card-footer-item color-secondary' to={`/admin/add-post/${post._id}?edit=true`}>Edit</Link>
                            <a className="card-footer-item color-secondary">
                              <button className='button is-ghost decNone' onClick={() => { openModal2(post._id) }}>Delete</button>
                            </a>
                          </>
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
            )}

          </>

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

      <Modal notiTitle={notiTitle} notiBody={notiBody} handleClose={closeModal} />
      <ModalDelete notiTitle={notiDeleteTitle} notiBody={notiDeleteBody} handleClose={closeModal2} processDelete={processDelete} />





    </main >
  )
}

export default MyPosts