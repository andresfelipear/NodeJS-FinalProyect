import React, { useState, useEffect, useContext, useCallback } from 'react'
import { UserContext } from "../../context/UserContext";
import { useLocation, useNavigate, useParams } from 'react-router-dom'


function AddPost() {

    //query string edit
    const { search } = useLocation();
    const myUrl = new URLSearchParams(search)
    const param = myUrl.get('edit')

    //param postId
    const { postId } = useParams();

    const [title, setTitle] = useState("")
    const [imageUrl, setImageUrl] = useState("img1")
    const [description, setDescription] = useState("")
    const [editing, setEditing] = useState(param ? param : false)
    const [disabled, setDisabled] = useState(true);
    const [status, setStatus] = useState("");
    const [userContext, setUserContext] = useContext(UserContext);
    const [post, setPost] = useState()

    const navigate = useNavigate()
    const location = useLocation()

    const fetchPost = useCallback(() => {
        fetch(process.env.REACT_APP_API_ENDPOINT + `/api/admin/getPost/${postId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`,
            },
        }).then(async (response) => {
            if (response.ok) {
                const data = await response.json();
                setPost(data.post);
                setTitle(data.post.title);
                setImageUrl(data.post.imageUrl);
                setDescription(data.post.description);
            }
        });
    }, [postId, userContext.token])

    useEffect(() => {
        if (editing) {
            fetchPost();
        }
    }, [editing, fetchPost]);


    useEffect(() => {
        if (title && imageUrl && description) {
            setDisabled(false)
        }else{
            setDisabled(true)
        }
    }, [title, imageUrl, description])

    const submit = () => {
        const body = { title, description, imageUrl, postId };
        if (!editing) {
            fetch(process.env.REACT_APP_API_ENDPOINT + "/api/admin/add-post", {
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
                    navigate('/', { replace: true })
                })
                .catch((err) => {
                    setStatus("error");
                });
        }
        else {
            fetch(process.env.REACT_APP_API_ENDPOINT + "/api/admin/edit-post", {
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
                    navigate('/', { replace: true })
                })
                .catch((err) => {
                    setStatus("error");
                });
        }



    };


    return (
        <main className="section mt-6 ">
            <div className="widthForm has-background-light">
                <div className="field">
                    <label className="label" htmlFor="title">Title</label>
                    <div className="control">
                        <input className="input" type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                </div>
                <label className="label" htmlFor="imageUrl">Image</label>
                <div className="field has-addons">

                    <div className="control has-icons-left">
                        <div className="select">
                            <select defaultValue="img1" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}>
                                <option value="img1">Image 1</option>
                                <option value="img2">Image 2</option>
                                <option value="img3">Image 3</option>
                                <option value="img4">Image 4</option>
                                <option value="img5">Image 5</option>
                                <option value="img6">Image 6</option>
                                <option value="img7">Image 7</option>
                                <option value="img8">Image 8</option>
                            </select>
                        </div>
                        <div className="icon is-large is-left has-text-info">
                            <i className={`fas fa-image`}></i>
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label className="label" htmlFor="title">Description</label>
                    <div className="control">
                        <textarea type="textarea" className="textarea" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>


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