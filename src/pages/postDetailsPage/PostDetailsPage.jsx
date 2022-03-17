import React from 'react'
import { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import {
    Heading,
    Notification,
} from "react-bulma-components";
import moment from 'moment'
import { UserContext } from "../../context/UserContext";
import './PostDetailsPage.css'

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
    const [isLoading, setIsLoading] = useState(false);
    const [userContext, setUserContext] = useContext(UserContext);
    const [disabled, setDisabled] = useState(true);
    const [comment, setComment] = useState("")

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
        }).catch(err => { console.log(err); setIsLoading(false); });
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
    }, [comments]);

    useEffect(() => {
        if (comment && userContext.details) {
            setDisabled(false)
        }else{
            setDisabled(true)
        }

        return () => {
            setIsLoading(false)
        }
    }, [comment])

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



    if (isLoading) {
        return (
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
                        {moment(post.date).format("MMMM Do YYYY, h:mm:ss a")}
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
                                    {moment(comment.date).format("MMMM Do YYYY, h:mm:ss a")}
                                </div>
                            </div>
                        </a>
                    )
                    )}
                    <form className='is-flex is-align-items-center panel-heading py-1 px-5' onSubmit={addComment}>
                        <input type="hidden" name="postId" value={post._id} />
                        <input className="input is-small is-size-6 is-static is-italic" type="text" name="comment" value={comment} placeholder="Add a comment..." onChange={(e)=>setComment(e.target.value)} />
                        <button
                            className="button is-ghost has-text-black has-text-weight-medium submitComment" 
                            type='submit'
                            disabled={disabled}
                        >Post
                        </button>
                    </form>


                </div>
            </div>

        </main >
    )
}

export default PostDetailsPage