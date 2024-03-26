import React, { useContext, useEffect, useState } from 'react';
import Header from '../../utilities/Header/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../..';
import { observer } from 'mobx-react-lite'
import Footer from '../../utilities/Footer/Footer';
import style from './style/offer.module.scss'

import defaultpic from './assets/default.png'
import seemap from './assets/seemap.png'
import profileicon from './assets/profile.svg'
import priceicon from './assets/price.svg'

import RequireAuth from '../../utilities/RequireAuth/RequireAuth';

import { YMaps, Map, ZoomControl, Placemark } from '@pbe/react-yandex-maps';


const Offer = () => {
  const params = useParams()
  const {store} = useContext(Context)
  const [offer, setOffer] = useState({})
  const [offerUser, setOfferUser] = useState({})

  const [modelOpened, setModelOpened] = useState(false)
  const [typeModel, setTypeModel] = useState("")

  const [rentDays, setRentDays] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const data = await store.getOffer(params.id);
      setOffer(data.offer)
      setOfferUser(data.offerUser)
    }
    fetchData();
  
  }, [])
  const SlicePrice = (price) => {
    price = price + ''
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  const changeRentDays = (e) => {
    if(e.target.value >= 0 && e.target.value <= 365) setRentDays(parseInt(e.target.value))
  }
 
  const sendRequest = async () => {
    if(rentDays < 1 && typeModel == "rent") return store.setErrors(["Введите количество дней для аренды!"])

    const response = await store.createRequest(offer.id, store.user.id, store.user.phoneNumber, typeModel == "rent" ? rentDays : null)
    if(response?.success) navigate("/profile")
  }

  return (
    <RequireAuth>
      <Header/>
      <div className={modelOpened ? style.model__window : style.model__window__hidden}>
          <div className={style.model__content}>
            <div className={style.close} onClick={() => {
                  setModelOpened(false)
                }}>
                  &times; 
            </div>
            <div className={style.title}>Подача заявки</div>
            <div className={style.warning}>Внимательно  проверьте все свои данные перед подачей заявления</div>
            <div className={style.modal__child}>Ваш номер телефона: <span>{store.user.phoneNumber}</span></div>
            <div className={style.modal__child}>Цена за недвижимость: <span>{SlicePrice(offer.price)} руб./месяц</span></div>
            <div className={style.modal__child}>Адрес: <span>{offer.adress}</span></div>
            {typeModel == "rent" ? <div className={style.modal__child}>Количество дней аренды: <input type="number" min={0} max={365} value={rentDays} onChange={changeRentDays}/></div> : null}
            <div className={style.access}>Если всё верно, нажмите “Подать заявку”</div>
            <a className={style.send} href='#' onClick={() => {
              sendRequest()
            }}>Подать заявку</a>
          </div>
      </div>
      <div className={style.wrapper}>
        <div className={style.content}>
          <img className={style.main__banner} src={offer.imgURL ? offer.imgURL : defaultpic}/>
          <div className={style.slice}>
            <div className={style.left}>
              <div className={style.buttons}>
                <a className={style.see} href='#' onClick={() => {
                  setModelOpened(true)
                  setTypeModel("see")
                }}>Осмотреть недвижимость</a>
                <a className={style.rent} href='#' onClick={() => {
                  setModelOpened(true)
                  setTypeModel("rent")
                }}>Арендовать жильё</a>
              </div>
              <div className={style.adress}>{offer.adress}</div>
              <div className={style.short__desc}>{offer.shortDescription}</div>

              <div className={style.description__title}>Описание</div>
              <div className={style.description}>{offer.description}</div>
            </div>
            <div className={style.right}>
              <div className={style.map}>

                <YMaps>
                  <Map 
                  defaultState={{ center: [offer.mapCordX, offer.mapCordY], 
                    zoom: 18, 
                    controls: ["zoomControl", "fullscreenControl"] 
                  }} 
                  modules={["control.ZoomControl", "control.FullscreenControl", "Placemark"]} 

                  width={"100%"} height={"240px"}>
                      <ZoomControl options={{ float: "right" }} />
                      <Placemark  defaultGeometry={[offer.mapCordX, offer.mapCordY]} />
                  </Map>
                </YMaps>

              </div>
              <div className={style.contact__title}>Контакт</div>
              <div className={style.contact}>
                <img src={profileicon}/>
                <div className={style.contact__info}>
                  <div className={style.contact__name}>{offerUser.username}</div>
                  <div className={style.contact__phone}>{offer.phoneNumber}</div>
                </div>
              </div>
              <div className={style.price__title}>Цена</div>
              <div className={style.price}>
                <img src={priceicon}/>
                <div className={style.info}>
                  <div className={style.cost}>{SlicePrice(offer.price)} руб./месяц</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </RequireAuth>
  )
}

export default observer(Offer);
