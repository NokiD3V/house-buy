import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';
import { observer } from 'mobx-react-lite'
import Header from '../../utilities/Header/Header';
import Footer from '../../utilities/Footer/Footer';
import style from './style/settings.module.scss'
import { useForm } from 'react-hook-form';

import defaultAvatar from './assets/noprofile.png'

const Settings = () => {
  const {store} = useContext(Context)

  const navigate = useNavigate()

  const {
    register, 
    handleSubmit,
    formState: {errors}
  } = useForm()

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageURL, setImageURL] = useState(null)

    return (
      <div>
        <Header/>
        <div className={style.wrapper}>
          <div className={style.content}>
            <div className={style.content__title}>Настройки пользователя</div>
            <form onSubmit={handleSubmit(async (data) => {
              let success = false;
              console.log(data)
              if(data.oldpass.length > 0){
                if(data.newpass != data["newpass2"]) return store.setErrors(["Пароли не совпадают!"])
                if(data.oldpass == data.newpass) return store.setErrors(["Новый пароль не должен совпадать со старым"])
                if(data.newpass.length < 6) return store.setErrors(["Пароль должен иметь как минимум 6 символов"])

                success = await store.changePass(data.oldpass, data.newpass)
              }
              if(data.phone.length > 0){
                let isPhoneNumber = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(data.phone);
                console.log(isPhoneNumber)
                if(!isPhoneNumber) return store.setErrors(["Вы ввели не номер телефона!"])
                console.log(isPhoneNumber)
                success = await store.changeNumber(data.phone)
              }

              if(store.user.avatarURL != null && selectedImage == defaultAvatar){
                success = await store.clearAvatar()
                console.log('1 случай')
              }
              else if(selectedImage != null){
                success = await store.changeAvatar(selectedImage)
                console.log('2 случай')
              }
           
              if(success) navigate('/profile')
            })}>
              <div className={style.data}>
                <div className={style.info}>
                  <div className={style.email}>Email адрес: <span>{store.user.email}</span></div>
                  <div className={style.changepass__title}>Изменение пароля</div>
                  <div className={style.changepass}>
                    <div className={style.changepass__old}>
                      <div className={style.pass__title}>Старый пароль</div>
                      {errors.oldpass ? <div className={style.error}>Введите корректный пароль</div> : null}
                      <div className={style.pass}>
                          <input type="password" placeholder='СтарыйПароль' min={0} {...register('oldpass')}/>
                      </div>
                    </div>
                    <div className={style.changepass__new}>
                      <div className={style.pass__title}>Новый пароль</div>
                      {errors.oldpass ? <div className={style.error}>Введите корректный пароль</div> : null}
                      <div className={style.pass}>
                          <input type="password" placeholder='НовыйПароль' min={0} {...register('newpass')}/>
                      </div>
                    </div>
                    <div className={style.changepass__new}>
                    <div className={style.pass__title}>Повтор нового пароля</div>
                      {errors.oldpass ? <div className={style.error}>Введите корректный пароль</div> : null}
                      <div className={style.pass}>
                          <input type="password" placeholder='ПовторНовогоПароля' min={0} {...register('newpass2')}/>
                      </div>
                    </div>
                  </div>
                  <div className={style.phone}>
                    <div className={style.phone__title}>Номер телефона</div>
                    {errors.phone ? <div className={style.error}>Введите корректный номер!</div> : null}
                    <div className={style.phone__select}>
                        <input type="text" placeholder='+7912345678' value={store.user.phone} {...register('phone', { pattern: /\d+/, minLength: 10, maxLength:12})}/>
                    </div>
                  </div>
                </div>
                <div className={style.avatar}>
                  <img src={imageURL || store.user.avatarURL || defaultAvatar} alt="" className={style.avatar} />
                  <div className={style.buttons}>
                    <input type="file" onChange={(e) => {
                      if(e.target.files.length == 0) return setSelectedImage(null), setImageURL(null)
                      if(e.target.files.length != 1) return store.setErrors(["Выберите один файл"])

                      if(e.target.files[0]?.type != "image/jpeg" & e.target.files[0]?.type != "image/png") return store.setErrors(["Выберите изображение формата .png или .jpg (.jpeg)"])                      
                      setSelectedImage(e.target.files[0])
                      setImageURL(URL.createObjectURL(e.target.files[0]))
                    
                    }} id='file'  accept=".jpg, .png, .jpeg"/>
                    <label htmlFor='file'>
                      Загрузить
                    </label>
                    <button className={style.reset} type="button" onClick={() => {
                      setSelectedImage(defaultAvatar)
                      setImageURL(defaultAvatar)
                    }}>Сбросить</button>
                  </div>
                </div>
              </div>
              <button type="submit" className={style.submit}>Сохранить</button>
            </form>
          </div>
        </div>
        <Footer/>
      </div>
    )
}

export default observer(Settings);
