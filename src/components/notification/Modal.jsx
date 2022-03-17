import React from 'react'
import {
    Heading,
    Notification,
  } from "react-bulma-components";

function Modal({notiTitle, notiBody, handleClose}) {
  return (
    <div className="modal" id="modal-container">
        <div className="modal-background"></div>
        <div className="modal-content">

          <Notification p={5} m={6} color="warning">
            <Heading mb={2} >{notiTitle}</Heading>
            {notiBody}.
          </Notification>
        </div>
        <button className="modal-close is-large" aria-label="close" onClick={handleClose}></button>
      </div>
  )
}

export default Modal