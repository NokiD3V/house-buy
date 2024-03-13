import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';
import { observer } from 'mobx-react-lite'
import Header from '../../utilities/Header/Header';
import style from './style/register.module.scss'
import Loader from '../../utilities/Loader/Loader';
import { useForm } from 'react-hook-form';

const RegisterPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [secondPassword, setSecondPassword] = useState('')
    const {store} = useContext(Context)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm()

    useEffect(() => {
        if(localStorage.getItem('token')){
            store.checkAuth()
        }
    }, [])

    useEffect(() => {
        console.log(errors)
    },[errors])

    if(store.isLoading){
        return <Loader/>
    }

    if(store.isAuth){
        console.log(store.isAuth)
        window.location.href = "/login"
        return
    }
    
    return (
        <div> 
            <Header/>
            <div className={style.wrapper}>
                <div className={style.content}>
                    <form className={style.form} onSubmit={handleSubmit((data) => {
                            console.log(data)
                            if(data.password != data.passwordsecond) return store.setErrors(["Пароли не совпадают!"])
                            const sendData = {
                                email: data.email,
                                password: data.password,
                                username: `${data.surname} ${data.name} ${data.fathername}`,
                                phoneNumber: data.phonenumber
                            }

                            store.registration(sendData)
                        })}>
                        <div className={style.title}>Регистрация</div>
                        <div className={style.email}>
                            <span>Email</span>
                            <input type="email" name="email" placeholder='email@example.org' {...register('email', {required: true, minLength: 5})}/>
                            { errors?.email?.type ? <div className={style.error}>Введите достоверный email</div> : null}
                        </div>
                        <div className={style.password}>
                            <span>Пароль</span>
                            <input type="password" name="passwordfirst" {...register('password', {required: true, minLength: 5})} placeholder='ОченьСложныйПароль'/>
                            { errors?.password?.type ? <div className={style.error}>Введите достоверный пароль</div> : null}
                        </div>
                        <div className={style.password}>
                            <span>Повтор пароля</span>
                            <input type="password" name="passwordsecond" {...register('passwordsecond', {required: true, minLength: 5})} placeholder='ОченьСложныйПароль'/>
                            { errors?.passwordsecond?.type ? <div className={style.error}>Введите достоверный повтор пароля</div> : null}
                        </div>
                        <div className={[style.name, style.name__child].join(" ")}>
                            <span>Имя</span>
                            <input name="passwordsecond" {...register('name', {required: true})} placeholder='Иван'/>
                            { errors?.name?.type ? <div className={style.error}>Введите имя</div> : null}
                        </div>
                        <div className={[style.name, style.name__child].join(" ")}>
                            <span>Фамилия</span>
                            <input name="passwordsecond" {...register('surname', {required: true})} placeholder='Иванов'/>
                            { errors?.surname?.type ? <div className={style.error}>Введите фамилию</div> : null}
                        </div>
                        <div className={[style.name, style.name__child].join(" ")}>
                            <span>Отчество</span>
                            <input name="passwordsecond" {...register('fathername', {required: true})} placeholder='Иванович'/>
                            { errors?.fathername?.type ? <div className={style.error}>Введите отчество</div> : null}
                        </div>
                        <div className={[style.name, style.name__child].join(" ")}>
                            <span>Номер телефона</span>
                            <input type="text" name="passwordsecond" {...register('phonenumber', {required: true, minLength: 10, maxLength:12})} placeholder='8900000000'/>
                            { errors?.phonenumber?.type ? <div className={style.error}>Введите достоверный номер телефона</div> : null}
                        </div>
                        <a href="/login" className={style.login__btn}>Есть аккаунт? Авторизируйтесь!</a>
                        <input type="submit" className={style.register__btn} value="Создать аккаунт"/>
                    </form>
                </div>
            </div>
        </div>
            
    );
}

export default observer(RegisterPage);
