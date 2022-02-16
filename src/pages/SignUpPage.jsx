import React from 'react'

export default function SignUpPage() {
  return (
    <main class="container mt-6">

        <form action="/signup" method="post">

            <div class="field">
                <label class="label" for="username">Username</label>
                <div class="control">
                    <input class="input" type="text" name="username" />
                </div>
            </div>
            <div class="field">
                <label class="label" for="username">Email</label>
                <div class="control">
                    <input class="input" type="email" name="email" />
                </div>
            </div>
            <div class="field">
                <label class="label" for="username">Password</label>
                <div class="control">
                    <input class="input" type="password" name="password" />
                </div>
            </div>
            <div class="field">
                <label class="label" for="username">Confirm Password</label>
                <div class="control">
                    <input class="input" type="password" name="confirmPassword" />
                </div>
            </div>

            <button class="button is-primary" type="submit">
                Sign Up
            </button>

        </form>

    </main>
  )
}
