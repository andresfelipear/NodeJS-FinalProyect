import React, { useState } from 'react'


function AddPost() {
    const post = {
        title: "title",
        description: "description",
        imageUrl: "imageUrl"
    }

    const [editing, setEditing] = useState(false)


    return (
        <main className="section mt-6 ">
            <div className="widthForm has-background-light">
                <div class="field">
                    <label className="label" for="title">Title</label>
                    <div className="control">
                        <input className="input" type="text" name="title" value={editing ? post.title : ""} />
                    </div>
                </div>
                <div className="field">
                    <label className="label" for="title">Image (url)</label>
                    <div className="control">
                        <input className="input" type="text" name="imageUrl" value={editing ? post.imageUrl : ""} />
                    </div>
                </div>
                <div className="field">
                    <label className="label" for="title">Description</label>
                    <div className="control">
                        <textarea className="textarea" name="description" rows="5">
                            {editing ? post.description : ""}</textarea>
                    </div>
                </div>

                {/* <% if(editing) { %>
            <input type="hidden" value="<%= post._id %>" name="postId" />
        <% } %> */}


                <div className="is-flex is-justify-content-center mt-4">
                    <button className="button is-success" type="submit">
                        <span className="icon is-small">
                            {editing?(<i className="fas fa-check"></i>):(<i className="fas fa-plus"></i>)}
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