import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from '../../utilities/Header/Header';
import { Context } from '../..';
import { observer } from 'mobx-react-lite'
import Footer from '../../utilities/Footer/Footer';
import style from './style/create.module.scss'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { YMaps, Map, ZoomControl, Placemark, Clusterer } from '@pbe/react-yandex-maps';

const Create = () => {
  const {store} = useContext(Context)

  const navigate = useNavigate()

  useEffect(() => {
    if(store.user?.create == false){
      navigate("/profile", {replace: true})
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm()

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageURL, setImageURL] = useState(null)
  
  const ymaps = useRef(null);
  const placemarkRef = useRef(null);
  const mapRef = useRef(null);
  const [address, setAddress] = useState([]);

  const createPlacemark = (coords) => {
    return new ymaps.current.Placemark(
      coords,
      {
        iconCaption: "Выбранная точка"
      },
      {
        preset: "islands#violetDotIconWithCaption",
        draggable: false
      }
    );
  };


  const onMapClick = (e) => {
    const coords = e.get("coords");
    console.log(coords)

    if (placemarkRef.current) {
      placemarkRef.current.geometry.setCoordinates(coords);
    } else {
      placemarkRef.current = createPlacemark(coords);
      mapRef.current.geoObjects.add(placemarkRef.current);
    }
    setAddress(coords)
  };
  
  return (
    <>
      <Header/>
      <div className={style.wrapper}>
        <div className={style.content}>
          <div className={style.head__title}>Создать объявление</div>            
          <form onSubmit={handleSubmit(async (data) => {
            if(selectedImage == null || imageURL == null) return store.setErrors(["Вы не выбрали изображене баннера"])
            if(address.length < 1) return store.setErrors(["Выберите метку на карте"])
           
            const success = await store.createOffer(data, selectedImage, address);
            if(success) return window.location.href = "/catalog"
          })}> 
            <div className={style.slacer}>
              <div className={style.slice__data}>
                <div className={style.location}>
                  <div className={style.location__title}>Местоположение</div>
                  {errors.location ? <div className={style.error}>Введите корректную локацию</div> : null}
                  <input type="text" placeholder='Введите адрес...' {...register("location", {required: true})} />
                </div>
                <div className={style.type}>
                  <div className={style.type__title}>Тип недвижимости</div>
                  {errors.type ? <div className={style.error}>Выберите тип недвижимости</div> : null}
                  <div className={style.type__buttons}>
                    <div className={style.type__input}><input id='home' type="radio" value={"home"} name='type' {...register('type', {required: true})}/><label htmlFor='home'>Дом</label></div>
                    <div className={style.type__input}><input id='flat' type="radio"value={"flat"}  name='type' {...register('type', {required: true})}/><label htmlFor='flat'>Квартира</label></div>
                    <div className={style.type__input}><input id='other' type="radio" value={"other"} name='type' {...register('type', {required: true})}/><label htmlFor='other'>Другое</label></div>
                  </div>
                </div>
                <div className={style.two__sides}>
                  <div className={style.price}>
                    <div className={style.price__title}>Цена</div>
                    {errors.price ? <div className={style.error}>Введите корректные числа!</div> : null}
                    <div className={style.price__select}>
                        <input type="number" placeholder='0 руб.' min={0} {...register('price', { pattern: /\d+/, min:0, required: true })}/>
                    </div>
                  </div>
                  <div className={style.phone}>
                    <div className={style.phone__title}>Номер телефона</div>
                    {errors.phone ? <div className={style.error}>Введите корректный номер!</div> : null}
                    <div className={style.phone__select}>
                        <input type="text" placeholder='+7912345678' min={0} {...register('phone', { pattern: /\d+/, required: true, minLength: 10, maxLength:12})}/>
                    </div>
                  </div>
                </div>
                <div className={style.map}>
                  <YMaps>
                    <Map 
                    defaultState={{ center: [43.1202304400753, 131.88398824315811], 
                    zoom: 12, 
                    controls: ["zoomControl", "fullscreenControl"], }} 
                    modules={["control.ZoomControl", "control.FullscreenControl", "geocode", "Placemark"]} 
                    instanceRef={mapRef}
                    onLoad={(ympasInstance) => (ymaps.current = ympasInstance)}
                    onClick={onMapClick}

                    width={"100%"} height={"400px"}>
                        <ZoomControl options={{ float: "right" }} />
                        {/* {address && (
                            <div>
                                <p>{address}</p>
                            </div>
                        )} */}
                    </Map>
                </YMaps>
                </div>
                <div className={style.upload}>
                  {/* <img src={imageURL} alt="" /> */}
                  <div className={style.upload__title}>Изображение недвижимости</div>
                  <div className={style.upload__buttons}>
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
                      setSelectedImage(null)
                      setImageURL(null)
                    }}>Сбросить</button>
                  </div>
                  
                </div>
              </div>


              <div className={style.slice__data}>
                <div className={style.short__desc}>
                  <div className={style.short__desc__title}>Короткое описание</div>
                  {errors.short_desc ? <div className={style.error}>Выберите тип недвижимости</div> : null}
                  <input type="text" placeholder='Введите описание ваших комнат...' {...register("short_desc", {required: true})} />
                </div>
                <div className={style.long__desc}>
                  <div className={style.long__desc__title}>Полное описание</div>
                  {errors.long_desc ? <div className={style.error}>Выберите тип недвижимости</div> : null}
                  <textarea type="text" placeholder='Введите полное описание вашего помещения' {...register("long_desc", {required: true})} />
                </div>
              </div>
            </div>
            
            { imageURL ? 
            
            <div className={style.images}>
              <div className={style.images__title}>Все форматы изображения</div>
              <img src={imageURL} id={style.mainbanner} width="1170" height="320" />
              <div className={style.side__images}>
                <img src={imageURL} id={style.banner} />
                <img src={imageURL} id={style.banner} />
                <div className={style.buttons}>
                  <a href='/create'>Сбросить всё</a>
                  <input type="submit" value="Создать" className={style.submit}/>
                </div>
              </div>
            </div>
            : 
            
            <div className={style.buttons}>
              <a href='/create'>Сбросить всё</a>
              <input type="submit" value="Создать" className={style.submit}/>
            </div>}
          </form>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default observer(Create);
