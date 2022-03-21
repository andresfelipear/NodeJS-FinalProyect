import React from 'react'
import {
    Button,
    Heading,
    Notification,
} from "react-bulma-components";

import  "./ModalDelete.css"

function ModalDelete({ notiTitle, notiBody, handleClose, processDelete }) {
    return (
        <div className="modal" id="modal-container2">
            <div className="modal-background"></div>
            <div className="modal-content widthMedium">
                <div className="message is-danger">
                    <div className="message-header">
                        {notiTitle}
                    </div>
                    <div className="message-body">
                        <div className='mb-4' >{notiBody}</div>
                        <div className="buttons">
                            <Button color="danger" value="Yes" onClick={processDelete}>Yes</Button>
                            <Button color="success" value="No" onClick={processDelete}>No</Button>
                        </div>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={handleClose}></button>
        </div>
    )
}

export default ModalDelete