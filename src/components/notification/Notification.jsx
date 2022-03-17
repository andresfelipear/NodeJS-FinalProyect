import React from 'react'
import {
    Heading,
    Notification,
  } from "react-bulma-components";

function Notification({notiTitle, notiBody, closeModal}) {
  return (
    <div className="modal" id="modal-container">
        <div className="modal-background"></div>
        <div className="modal-content">

          <Notification p={5} m={6} color="warning">
            <Heading mb={2} >{notiTitle}</Heading>
            {notiBody}.
          </Notification>
        </div>
        <button className="modal-close is-large" aria-label="close" onClick={closeModal}></button>
      </div>
  )
}

export default Notification