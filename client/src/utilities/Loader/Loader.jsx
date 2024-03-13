import React, { useContext, useEffect } from 'react';
import loadingImage from './assets/icon.svg'
import style from './style/loader.module.scss'
/**
 * @description Loader of pages
 */

const Loader = () => {
    return (
        <div className={style.loader}>
            <div className={style.title}>Загрузка данных...</div>
            <img src={loadingImage} alt=":)" className={style.img}/>
            <div className={style.tip}>Совсем скоро вы увидите страницу!</div>
        </div>
    );
}

export default Loader;