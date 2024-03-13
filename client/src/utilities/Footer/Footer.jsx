import React, { useContext, useEffect } from 'react';
import style from './style/footer.module.scss'

import yt from './assets/yt.svg'
import vk from './assets/vk.svg'
import lin from './assets/lin.svg'


/**
 * @description Footer for pages
 */

const Footer = () => {
    return (
        <footer>
            <div className={style.wrapper}>
                <div className={style.links}>
                    <div className={style.link__item}><a href='#'>О нас</a></div>
                    <div className={style.link__item}><a href='#'>Блог</a></div>
                    <div className={style.link__item}><a href='#'>Вакансии</a></div>
                    <div className={style.link__item}><a href='#'>Помощь</a></div>
                    <div className={style.link__item}><a href='#'>Условия пользования</a></div>
                    <div className={style.link__item}><a href='#'>Политика конфиденциальности</a></div>
                </div>
                <div className={style.socials}>
                    <a href="#"><img src={yt} alt="YT" /></a>
                    <a href="#"><img src={vk} alt="VK" /></a>
                    <a href="#"><img src={lin} alt="in" /></a>
                </div>
                <div className={style.copyright}>2024 © Иммобилиаре</div>
            </div>
        </footer>
    );
}

export default Footer;