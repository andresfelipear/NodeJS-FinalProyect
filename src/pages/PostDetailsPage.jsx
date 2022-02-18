import React from 'react'
import { post } from '../../../backend/routes/admin.route'

function PostDetailsPage() {
    
    return (
        <main class="container is-max-desktop mt-6">
            <div class="card p-5">
                <div class="card-header-title px-5">
                    <div class="media-content">
                        <p class="title is-4 is-capitalized">
                            {post.title}
                        </p>
                        <p class="subtitle is-6">@{post.username}
                        </p>
                    </div>
                    <em>
                        {new Intl.DateTimeFormat('en-GB', {
                            year: 'numeric', month: 'long', day: '2-digit',
                            hour: 'numeric', minute: 'numeric', hour12: true
                        }).format(post.date)}
                    </em>
                </div>
                <div class="card-image px-5">
                    <figure class="image is-4by3">
                        <img src="/<%= post.imageUrl %>" alt="<%= post.title%>" width="100px" />
                    </figure>
                </div>
                <div class="card-content">
                    <div class="content has-text-justified">
                        {post.description}

                    </div>
                </div>
                {autofocus ? (<div class="panel" tabindex="0" autofocus />) : (<div class="panel" tabindex="0" />)}
                {post.comment && (<div className="panel">
                    <p class="panel-heading">
                        Comments
                    </p>

                    {
                        post.map((comment) => {
                            <a class="panel-block">
                                <span class="panel-icon">
                                    <i class="fas fa-user-astronaut"></i>
                                </span>
                                <div class="is-italic ml-2">

                                    <div class="title is-6">
                                        {comment.comment}
                                    </div>
                                    <div class="subtitle is-6">
                                        {new Intl.DateTimeFormat('en-GB', {
                                            year: 'numeric', month: 'long',
                                            day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true
                                        }).format(comment.date)}
                                    </div>
                                </div>


                            </a>
                        })
                    }
                </div>)}

                )

            </div>

        </main >
    )
}

export default PostDetailsPage