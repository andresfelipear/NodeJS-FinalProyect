import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from "../../context/UserContext";
import { useLocation, useNavigate } from 'react-router-dom'

function AddPost() {


    const post = {
        title: "title",
        description: "description",
        imageUrl: "imageUrl"
    }
    const [title, setTitle] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [description, setDescription] = useState("")
    const [editing, setEditing] = useState(false)
    const [disabled, setDisabled] = useState(true);
    const [status, setStatus] = useState("");
    const [userContext, setUserContext] = useContext(UserContext);

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (title && imageUrl && description) {
            setDisabled(false)
        }
    }, [title, imageUrl, description])

    const submit = () => {
        const body = { title, description, imageUrl };
        fetch("http://localhost:8000/api/admin/add-post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`,
            },
            body: JSON.stringify(body),
            credentials: "include"
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(res.status);
                }
                return res.json();
            })
            .then((data) => {
                setStatus("success");
                // let from = location.state?.from?.pathname || '/'
                navigate('/', { replace: true })
            })
            .catch((err) => {
                setStatus("error");
            });

    };


    return (
        <main className="section mt-6 ">
            <div className="widthForm has-background-light">
                <div class="field">
                    <label className="label" for="title">Title</label>
                    <div className="control">
                        <input className="input" type="text" name="title" value={editing ? post.title : title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                </div>
                <div className="field">
                    <label className="label" for="title">Image (url)</label>
                    <div className="control">
                        <input className="input" type="text" name="imageUrl" value={editing ? post.imageUrl : imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    </div>
                </div>
                <div className="field">
                    <label className="label" for="title">Description</label>
                    <div className="control">
                        <textarea className="textarea" name="description" rows="5" onChange={(e) => setDescription(e.target.value)}>
                            {editing ? post.description : description}</textarea>
                    </div>
                </div>

                {/* <% if(editing) { %>
            <input type="hidden" value="<%= post._id %>" name="postId" />
        <% } %> */}


                <div className="is-flex is-justify-content-center mt-4">
                    <button
                        className={`button ${disabled && 'is-danger'} ${!disabled && 'is-success'}`}
                        type="submit"
                        disabled={disabled}
                        onClick={submit}
                    >
                        <span className="icon is-small">
                            {editing ? (<i className="fas fa-check"></i>) : (<i className="fas fa-plus"></i>)}
                        </span>
                        <span>
                            {editing && "Edit"}
                            {!editing && "Add"}
                            Post
                        </span>
                    </button>

                </div>

            </div>

        </main>

    )
}

export default AddPost