import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';
import { observer } from 'mobx-react-lite'
import Loader from '../../utilities/Loader/Loader';
import Header from '../../utilities/Header/Header';
import Footer from '../../utilities/Footer/Footer';
import style from './style/profile.module.scss'

import profileimg from './assets/profile.svg'
import banner from './assets/banner.png'
import defaultAvatar from './assets/noprofile.png'
import shieldIcon from './assets/shield.svg'

const ProfilePage = () => {
    const {store} = useContext(Context)
    const [requests, setRequests] = useState([])

    async function getRequests() {
      let requests = await store.requestsSelf() 
      setRequests(requests)
    }

    useEffect(() => {

      getRequests()
      
    }, [])

    

    return (
      <div>
        <Header/>
        <div className={style.wrapper}>
          <div className={style.content}>
            <div className={style.profile}>
              <div className={style.title}>Приветствую, {store.user.username.split(" ")[1]}!</div>
              <img src={store.user.avatarURL ? store.user.avatarURL : defaultAvatar} alt="" className={style.avatar} />
              <div className={style.user__title}>Ваши контактные данные:</div>
              <div className={style.user__phone}>Номер телефона: <span>{store.user.phoneNumber}</span></div>
              <div className={style.user__username}>ФИО: <span>{store.user.username}</span></div>
              <div className={style.change}><a href="/settings" className={style.change__btn}>Изменить профиль</a></div>
              <div className={style.logout} onClick={() => {
                store.logout()
              }}>Выйти</div>
              {store.user.admin ? <a href='/admin' className={style.admin__href}><div className={style.admin__btn}>Смотреть заявки</div></a> : null}
            </div>
            <div className={style.requests}>
              <div className={style.title}>Ваши заявки:</div>
              <div className={style.requests__list}>
                {requests.map(n => {

                  return <div className={style.request__item__wrapper}>
                   <a className={style.request__item} href={`/offers/${n.offer.id}`}>
                    <img src={n.offer.imgURL ? n.offer.imgURL : banner} className={style.banner}/>
                    <div className={style.info}>
                      <div className={style.adress}>
                        <span>{n.offer.adress} {n.request?.rentTime ? `(Аренда на ${n.request.rentTime} д.)` : null}</span>
                        <div className={style.type}>{
                          n.request.closed ? 
                            <div className={n.request.closedType == 0 ? style.denied : style.success}>{n.request.closedType == 0 ? "Отказано" : "Одобрено"}</div>
                          : <div className={style.progress}>В обработке</div>
                        }</div>
                      </div>
                      <div className={style.description}>{n.offer?.description.length > 170 ? n.offer.description.substr(0, 170) + "..." : n.offer.description}</div>
                      <div className={style.contacts}>
                        <div className={style.user}>
                          <img src={profileimg} />
                          <div className={style.contact__info}>
                            <div className={style.name}>{n.offerContact.name}</div>
                            <div className={style.phone}>{n.offer.phoneNumber}</div>
                          </div>
                        </div>
                        {n.request.closed ?
                          <div className={style.admin}>
                            <img src={shieldIcon} className={style.shield}/>
                            <div className={style.contact__info}>
                              <div className={style.name}>{n.admin.username.split(" ")[1]}</div>
                              <div className={style.phone}>{n.admin.phoneNumber}</div>
                            </div>
                          </div>
                        : null}
                         
                      </div>
                    </div>
                  </a>
                  {n.request.closed && n.request?.closedComment?.length > 0 ? <div className={style.comment}><span>Комментарий:</span> {n.request.closedComment}</div> : null}
                  </div>
                })}
              </div>
            </div>


          </div>
        </div>
        <Footer/>
      </div>
    )
}

export default observer(ProfilePage);
