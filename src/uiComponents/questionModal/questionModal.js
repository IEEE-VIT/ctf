/* eslint-disable react/jsx-no-target-blank */
import React, {useState, useEffect} from 'react';
import Modal from 'react-modal';
import { ToastContainer } from 'react-toastify';
import Recaptcha from 'react-recaptcha';

import arrow from '../../assets/arrow.png';
import './questionModal.css';

// importing helper function
import {getHint, answerQuestion, reCaptchaCheck} from '../../utils/userHelperFuncs'

// importing components
import { toastError, toastSuccess } from '../toasts/toasts.js';

// create a variable to store the component instance
let recaptchaInstance;
 
// manually trigger reCAPTCHA execution
const executeCaptcha = function () {
  recaptchaInstance.execute();
};

const QuestionModal = ({isOpen, handleAnswerSubmit, closeModal, question, qid, hindUsed, onAnswerCorrect}) => {
    const [confirm, setConfirm] = useState(false);
    const [hint, setHint] = useState('')
    const [answer, setAnswer] = useState('');
    const [token, setToken] = useState('');
    const [verified, setVerified] = useState(false);
    const [checking, setChecking] = useState(false);

    const verifyCallback = (token) => {
        if (token) {
            setToken(token);
            setVerified(true);
            console.log('Token: ', token);
        }
        else {
            toastError("ReCaptcha verification failed! Please reload page and attempt again!");
        }
    }

    const expiredCallback = () => {
        console.log('################## Token expired #################')
        setToken('');
        setVerified(false);
        toastSuccess("You have had that question open for years now! Are you going to answer?");
        recaptchaInstance.execute();
    }

    const getHintFromAPI = async () => {
        try {
            const hint = await getHint(qid);
            setHint(hint);
        } catch (err) {
            console.log(err);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    }

    const checkAnswer = async () => {
        if (!verified) {
            toastError("Hey! Your reCaptcha expired, please reload this page before signing up. We are sorry for the inconvenience caused.");
        }
        setChecking(true);
        reCaptchaCheck(token)
            .then(() => answerQuestion(qid, answer))
            .then((check) => {
                console.log("Answer check: ", check);
                if (check) {
                    onAnswerCorrect();
                    closeModal();
                    return;
                }
                toastError('Oops! Wrong Answer');
                recaptchaInstance.reset();
                recaptchaInstance.execute();
            })
            .catch((err) => {
                console.log(err);
                toastError(err.message ? err.message : err);
            })
            .finally(() => setChecking(false))
    }

    useEffect((hintUsed) => {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log(isOpen);
        if (isOpen) {
            setTimeout(() => {
                executeCaptcha();
            }, 2000);
        }
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@");
        const getData = async () => {
            try {
                const hint = await getHint(qid);
                setHint(hint);
            } catch (err) {
                console.log(err);
            }
        }
        if (hintUsed) {
            getData();
            return;
        } else {
            setHint('');
            setConfirm(false);
            setAnswer('');
        }
    },
    [hindUsed, qid]);

    const renderHint = () => {

        if (hint !== '') {
            return <div style={{alignSelf: 'center'}}>Hint: {hint}</div>
        }
       
        if (confirm) {
            return (
                <div style={{alignSelf: 'center'}}>
                    <div className="question_modal__hint" onClick={() => getHintFromAPI()}>I need this hint</div>
                    <div className="question_modal__hint" onClick={() => setConfirm(false)}>Nah, will try more</div>
                </div>
            );
        }

        return (
            <div className="question_modal__hint" onClick={() => setConfirm(true)}>Use a hint</div>
        );
    }
    
    return (
        <Modal 
            isOpen={!!isOpen} 
            onRequestClose={handleAnswerSubmit}
            contentLabel={question['description']}
            closeTimeoutMS={200}
            className="question_modal"
        >
            <ToastContainer
                draggable
                position="bottom-right"
            />
            <div className="question_modal_title_container">
                <h3 className="question_modal__title">{question['name']} - 100 points</h3>
                <div className="question_modal_close_button" onClick={()=>closeModal()}>X</div>
            </div>
            <div className="modal__question">
                {question['description']}
            </div>
            <div className="modal__link">
                <a href={question['url']} target="_blank">{question['url']}</a>
            </div>
            <div className="question_modal__answer_container">
                <input type='text' className="modal__answer__input" placeholder="Answer here" value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={handleKeyDown}/>
                <div className="question_modal__answer__button" onClick={() => checkAnswer()}><img src={arrow} className="img_answer" alt="" /></div>
            </div>
            {
                checking === true
                ?
                (<div className="question_modal__hint" >Checking...</div>)
                :
                renderHint()
            }
            <Recaptcha
                ref={e => recaptchaInstance = e}
                sitekey={process.env.REACT_APP_SITEKEY}
                render="explicit"
                size="invisible"
                verifyCallback={verifyCallback}
                expiredCallback={expiredCallback}
                onloadCallback={(res)=>{
                    console.log("Loaded captcha")
                }} 
            />
        </Modal>
    );
}

export default QuestionModal;