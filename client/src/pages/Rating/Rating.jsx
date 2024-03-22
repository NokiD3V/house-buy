import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';
import { observer } from 'mobx-react-lite'
import Header from '../../utilities/Header/Header';
import Footer from '../../utilities/Footer/Footer';
import style from './style/rating.module.scss'
import { useForm } from 'react-hook-form';

import defaultAvatar from './assets/profile.svg'

const Rating = () => {
  const {store} = useContext(Context)

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm()

  const [ratings, setRatings] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await store.getRatings();
      setRatings(data)
    }
    fetchData();
  
  }, [])

    return (
      <div>
        <Header/>
        <div className={style.wrapper}>
          <div className={style.content}>
            <div className={style.content__title}>Отзывы</div>
            {store.isAuth ? 

            <form onSubmit={handleSubmit(async (data) => {
              if(data.message.length < 30) return store.setErrors(["Сообщение должно содержать как минимум 30 символов"])

              const {success} = await store.createRating(data.message)
              if(success) window.location.reload()
            })}>
              <textarea placeholder='Введите ваш отзыв здесь!' {...register('message', {required: true})}></textarea>
              <button type="submit">Отправить</button>
            </form> 
             
            : null}
            <div className={style.ratings}>
              {ratings.map(n => {
                return <div className={style.rating__item}>
                    <img src={n.user.avatarURL || defaultAvatar} alt="" className={style.avatar} />
                    <div className={style.data}>
                      <div className={style.title}>
                        <div className={style.name}>{n.user.username}</div>
                        <div className={style.date}>{new Date(n.rating.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className={style.description}>{n.rating.message}</div>
                    </div>
              </div>
              })}
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    )
}

export default observer(Rating);
