import React from 'react'
import { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import {
    Heading,
    Notification,
  } from "react-bulma-components";

function PostDetailsPage() {
    //query string edit
    const { search } = useLocation();
    const myUrl = new URLSearchParams(search)
    const queryAutofocus = myUrl.get('autofocus')

    const { postId } = useParams();
    const [post, setPost] = useState([])
    const [comments, setComments] = useState([])
    const [error, setError] = useState("")
    const [autofocus, setAutofocus] = useState(queryAutofocus ? queryAutofocus : false)
    const [otherComments, setOtherComments] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const fetchPost = useCallback(() => {
        setIsLoading(true);
        //fetch post
        fetch(process.env.REACT_APP_API_ENDPOINT + `api/user/getPost/${postId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response) => {
            if (response.ok) {
                const data = await response.json();
                setPost(data.post)
                setIsLoading(false);
            }
            else {
                setError("Error fetching data (post)")
                setIsLoading(false);
            }
        }).catch(err => { console.log(err); setIsLoading(false) });
    }, [post])

    //fetch comments for that post
    const fetchComments = useCallback(() => {
        setIsLoading(true)
        fetch(process.env.REACT_APP_API_ENDPOINT + `api/user/getComments/${postId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response) => {
            if (response.ok) {
                const data = await response.json();
                setComments(data.comments)
                setIsLoading(false);
            }
            else {
                setError("Error fetching data (comments)")
                setIsLoading(false);
            }
        }).catch(err =>{console.log(err); setIsLoading(false);});
    }, [comments])

    useEffect(() => {
        if (post.length === 0) {
            fetchPost();
        }
    }, [post]);

    useEffect(() => {
        if (post.title) {
            fetchComments();
        }
    }, [post]);

    useEffect(() => {
        console.log(comments)
    }, [comments]);



    if (isLoading) {
        return(
            <Notification>
                <Heading>Loading...</Heading>
            </Notification>
        )
    }

    return (
        <main className="container is-max-desktop mt-6">
            {error && <div className="notification is-warning is-light p-2">
                {error}
            </div>}
            <div className="card p-5">
                <div className="card-header-title px-5">
                    <div className="media-content">
                        <p className="title is-4 is-capitalized">
                            {post.title}
                        </p>
                        <p className="subtitle is-6">@{post.username}
                        </p>
                    </div>
                    <em>
                        {/* {new Intl.DateTimeFormat('en-GB', {
                            year: 'numeric', month: 'long', day: '2-digit',
                            hour: 'numeric', minute: 'numeric', hour12: true
                        }).format(post.date)} */}
                        {post.date}
                    </em>
                </div>
                <div className="card-image px-5">
                    <figure className="image is-4by3">
                        <img src={`/images/${post.imageUrl}.${process.env.REACT_APP_API_FORMAT_IMAGES}`} alt={post.title} width="100px" />
                    </figure>
                </div>
                <div className="card-content">
                    <div className="content has-text-justified">
                        {post.description}

                    </div>
                </div>
                {/* {autofocus ? (<div className="panel" tabIndex="0" autoFocus />) : (<div className="panel" tabIndex="0" />)} */}

                <div className="panel" tabIndex="0" ref={(element) => { if (autofocus) element?.focus?.() }}>
                    <p className="panel-heading">
                        Comments
                    </p>
                    {comments && comments?.map((comment) =>
                    (
                        <a className="panel-block">
                            <span className="panel-icon">
                                <i className="fas fa-user-astronaut"></i>
                            </span>
                            <div className="is-italic ml-2">

                                <div className="title is-6">
                                    {comment.comment}
                                </div>
                                <div className="subtitle is-6">
                                    {/* {new Intl.DateTimeFormat('en-GB', {
                                        year: 'numeric', month: 'long',
                                        day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true
                                    }).format(comment.date)} */}
                                    {comment.date}
                                </div>
                            </div>


                        </a>
                    )
                    )}


                </div>
            </div>

        </main >
    )
}

export default PostDetailsPage