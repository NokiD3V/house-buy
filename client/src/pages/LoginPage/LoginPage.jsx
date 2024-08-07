import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';
import { observer } from 'mobx-react-lite'
import Header from '../../utilities/Header/Header';
import style from './style/loginpage.module.scss'
import image from './assets/image1.png'
import Loader from '../../utilities/Loader/Loader';
import ReCAPTCHA from "react-google-recaptcha";

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [captcha, setCaptcha] = useState()
    const {store} = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        if(store.isAuth && !store.isLoading){
            return navigate("/profile", {replace: true})
        }
    }, [store.isAuth])

    

    return (
        <div> 
            <Header/>
            <div className={style.wrapper}>
                <div className={style.content}>
                    <div className={style.form}>
                        <div className={style.title}>Aвторизация</div>
                        <div className={style.email}>
                            <span>Email</span>
                            <input type="email" name="email" placeholder='email@example.org' onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className={style.password}>
                            <span>Пароль</span>
                            <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} placeholder='ОченьСложныйПароль'/>
                        </div>
                        <ReCAPTCHA
                            sitekey='6LdHMvopAAAAACzq1vUoGz1QwIWxu8knuBzC2gNk'
                            style={{
                                marginTop:"20px"
                            }}
                            onChange={(e) =>{
                                setCaptcha(true)
                            }}
                        />
                        <a href="/register" className={style.register__btn}>Нет аккаунта? Зарегестрируйтесь!</a>
                        <a className={style.login__btn} href='#' onClick={() => {
                            if(!captcha) return store.setErrors(["Вы не ввели капчу!"])
                            store.login(email, password)
                        }}>Войти</a>
                    </div>
                </div>
            </div>
        </div>
            
    );
}

export default observer(LoginPage);
