import React, { useContext } from 'react';
import { Context } from '../..';
import { observer } from 'mobx-react-lite'
import Header from '../../utilities/Header/Header';
import style from './style/contact.module.scss'
import Footer from '../../utilities/Footer/Footer';

import adress from './assets/adress.svg'
import email from './assets/email.svg'
import phone from './assets/phone.svg'

import map from './assets/map.png'

const Contact = () => {
    return (
      <div>
        <Header/>
        <div className={style.wrapper}>
          <div className={style.content}>
           <div className={style.title}>Контактная информация</div>
           <div className={style.description}>Свяжитесь с нами по любому интересующему вам вопросу</div>
           <div className={style.two__sides}>
            <div className={style.info}>
              <div className={style.info__child}>
                <img src={phone} className={style.icon} />
                <div className={style.data}>
                  <div className={style.sub__title}>Номер телефона</div>
                  <div className={style.sub__description}>+79123456789</div>
                </div>
              </div>
              <div className={style.info__child}>
                <img src={adress} className={style.icon} />
                <div className={style.data}>
                  <div className={style.sub__title}>Адрес офиса</div>
                  <div className={style.sub__description}>г. Москва, ул. Популярная, д. 3, офис №4</div>
                </div>
              </div>
              <div className={style.info__child}>
                <img src={email} className={style.icon} />
                <div className={style.data}>
                  <div className={style.sub__title}>Email адрес</div>
                  <div className={style.sub__description}>test@gmail.com</div>
                </div>
              </div>
            </div>
            <div className={style.map}>
              <img src={map}/>
            </div>
           </div>
          </div>
        </div>
        <Footer/>
      </div>
    )
}

export default observer(Contact);
