import React, { useContext, useEffect } from 'react';
import style from './style/header.module.scss'
import logo from './assets/logo.svg'
import profile from './assets/profile.svg'
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
/**
 * @description Header for pages
 */

const Header = () => {
    const {store} = useContext(Context)

    useEffect(() => {
        console.log(store.localErros)
    }, [store.localErros])

    return (
        <div>
            <div className={style.header__wrapper}>
                <header>
                    <a href='/'><img src={logo} alt="Logo" className={style.logo}/></a>
                    <ul className={style.nav}>
                        <ul className={style.nav__item}><a href='/'>Главная</a></ul>
                        <ul className={style.nav__item}><a href='/catalog'>Каталог</a></ul>
                        <ul className={style.nav__item}><a href='/rating'>Отзывы</a></ul>
                        <ul className={style.nav__item}><a href='/contact'>Контакты</a></ul>
                    </ul>
                    {!store.isAuth ? 
                        <div className={style.login}><a href="/login">Войти</a></div>
                        : 
                        <div className={style.profile}><a href="/profile"><img src={profile} alt="[P]" /></a></div>
                    }
                </header>  
            </div>
            { store.localErros.length > 0 && store.localErros?.[0] != undefined ?       

            store.localErros.map(n => {
                return (
                    <div className={style.errors} >
                        <ul>
                            <li onClick={() => {
                        store.setErrors([])
                    }}>{n}</li>
                        </ul>
                    </div>
                )
            })


            : null
            }

        </div>

    );
}

export default observer(Header);