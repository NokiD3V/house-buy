import React, { useContext, useEffect, useState } from 'react';
import Header from '../../utilities/Header/Header';
import { Context } from '../..';
import { observer } from 'mobx-react-lite'
import Footer from '../../utilities/Footer/Footer';
import style from './style/admin.module.scss'
import RequireAuth from '../../utilities/RequireAuth/RequireAuth';
import { useNavigate } from 'react-router-dom';

import bagicon from './assets/bag.svg'
import profileicon from './assets/profile.svg'
import bannericon from './assets/defaultpic.png'

const Admin = () => {
  const {store} = useContext(Context)

  const [articles, setArticles] = useState([])
  const [comments, setComments] = useState({})

  const fetchData = async () => {
    setComments({})
    const data = await store.getRequests();
    setArticles(data)
    console.log("ARTICLES", data)
  }  

  useEffect(() => {

    fetchData();
  }, [])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const data = await store.isAdmin();
      if(!data) return;
      if(!data?.admin) navigate("/profile")
      console.log(data)
   }
   fetchData();
    
  }, [])

  const AcceptArticle = async (data) => {
    console.log(data)
    await store.RequestClose(data.requests.id, 1, comments[data.requests.id])
    window.location.reload()
  }

  const DenieArticle = async (data) => {
    console.log(data)
    await store.RequestClose(data.requests.id, 0, comments[data.requests.id])
    fetchData()
  }


  return (
    <>
      <Header/>
      <div className={style.wrapper}>
        <div className={style.content}>
           <div className={style.admin__title}>Заявки на рассмотрении:</div>
           <div className={style.articles}>
            {articles.map(n => {

              return <div className={style.article}>
              <a href={`/offers/${n.offer.id}`}><img src={bannericon} className={style.banner}/></a>
              <a className={style.info} href={`/offers/${n.offer.id}`}>
                <div className={style.adress}>{n.offer.adress}</div>
                <div className={style.description}>{n.offer.description.length > 170 ? n.offer.description.substr(0, 170) + "..." : n.offer.description}</div>
                <div className={style.users}>
                  <div className={style.offer__user}>
                    <img src={bagicon} />
                    <div className={style.data}>
                      <div className={style.username}>{n.offerUser.username.split(" ")[1]}</div>
                      <div className={style.phone}>{n.offer.phoneNumber}</div>
                    </div>
                  </div>
                  <div className={style.request__user}>
                    <img src={profileicon} />
                    <div className={style.data}>
                      <div className={style.username}>{n.requestUser.username.split(" ")[1]}</div>
                      <div className={style.phone}>{n.requests.phoneNumber}</div>
                    </div>
                  </div>
                </div>
              </a>
              <div className={style.admin__buttons}>
                <div className={style.buttons}>
                  <div className={style.accept} onClick={() => AcceptArticle(n)}>Принять</div>
                  <div className={style.denie} onClick={() => DenieArticle(n)}>Отклонить</div>
                </div>
                <div className={style.comment__title}>Комментарий:</div>
                <textarea name="" className={style.comment} placeholder='Введите комментарий для пользователя' value={comments[n.requests.id]} onChange={(e) => {
                  setComments({...comments, [n.requests.id]:e.target.value})
                }}></textarea>
              </div>
            </div>
            })}
           </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default observer(Admin);
