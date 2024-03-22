import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../..';
import { observer } from 'mobx-react-lite'
import Header from '../../utilities/Header/Header';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import style from './style/catalog.module.scss'

import deafultpic from './assets/deafultpic.png'
import microdefaultpic from './assets/microdefaultpic.png'
import mappic from './assets/map.png'
import Footer from '../../utilities/Footer/Footer';

const Catalog = () => {
    const {store} = useContext(Context)

    const [articles, setArticles] = useState([])

    const [searchParams, setSearchParams] = useSearchParams();

    const [hidden, setHidden] = useState(false)

    const navigate = useNavigate()

    const searchAsObject = Object.fromEntries(
      new URLSearchParams(searchParams)
    ); 

    const {
      register,
      handleSubmit,
      formState: {errors}
    } = useForm()
    

    useEffect(() => {
      const fetchData = async () => {
        const data = await store.getOffers();
        setArticles(data)
     }
     fetchData();
      
    }, [])

    const SlicePrice = (price) => {
      price = price + ''
      return price.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return (
      <div>
        <Header/>
        <div className={style.wrapper}>
          <div className={style.content}>
            <div className={style.head__title}>Аренда недвижимости</div>
            <div className={style.vip__articles}>

              {articles.slice(0, 3).map(n => {
                return <a className={style.article} href={`/offers/${n.id }`}>
                        <img src={n.imgURL || deafultpic} />
                        <div className={style.title}>{n.adress}</div>
                        <div className={style.price}>{SlicePrice(n.price)}. в месяц</div>
                      </a>
              })}
            </div>
            <div className={style.main__articles}>
              <div className={style.filter}>
                <div className={style.filter__title}>Фильтр</div>
                <form onSubmit={handleSubmit((data) => {
                  let link = "/catalog?"
                  if(data.location) link += "location=" + data.location + "&"
                  if(data.min) link += "min=" + data.min + "&"
                  if(data.max) link += "max=" + data.max + "&"
                  if(data.type) link += "type=" + data.type + "&"

                  navigate(link)
                })}>
                  <div className={style.type}>
                    <div className={style.type__title}>Тип недвижимости</div>
                    <div className={style.type__buttons}>
                      <div className={style.type__input}><input id='home' type="radio" value={"home"} name='type' {...register('type')}/><label htmlFor='home'>Дом</label></div>
                      <div className={style.type__input}><input id='flat' type="radio"value={"flat"}  name='type' {...register('type')}/><label htmlFor='flat'>Квартира</label></div>
                      <div className={style.type__input}><input id='other' type="radio" value={"other"} name='type' {...register('type')}/><label htmlFor='other'>Другое</label></div>
                    </div>
                  </div>
                  <div className={style.price}>
                    <div className={style.price__title}>Цена</div>
                    {errors.max || errors.min ? <div className={style.price__error}>Введите корректные числа!</div> : null}
                    <div className={style.price__select}>
                        <div className={style.price__input__min}>Минимально<input type="number" placeholder='0 руб.' min={0} {...register('min', { pattern: /\d+/, min:0 })}/></div>
                        <div className={style.price__input__max}>Максимально<input type="number" placeholder='>100.000 руб.' min={0} {...register('max', { pattern: /\d+/, maxLength: 7 })}/></div>
                    </div>
                  </div>
                  <div className={style.location}>
                    <div className={style.location__title}>Местоположение</div>
                    <input type="text" placeholder='Введите адрес...' {...register("location")} />
                  </div>
                  <input type="submit" value="Фильтровать" className={style.submit}/>
                </form>
                <a href="#" className={style.map}><img src={mappic} /></a>
              </div>
              <div className={style.articles}>
                {articles.filter(val => {
                  const {type} = searchAsObject;
                  if(type) return val.type == type
                  else return val
                })
                .filter(val => {
                  const {min} = searchAsObject;

                  if(min) return val.price >= min
                  else return val
                })
                .filter(val => {
                  const {max} = searchAsObject;
                  if(max) return val.price <= max
                  else return val
                })
                .filter(val => {
                  const {location} = searchAsObject;
                  if(location) return val.adress.includes(location)
                  else return val
                }).map(n => {
                  return <a className={style.article} href={`/offers/${n.id}`}>
                          <img src={n.imgURL || microdefaultpic} className={style.banner}/>
                          <div className={style.info}>
                            <div className={style.adress}>{n.adress}</div>
                            <div className={style.description}>{n.description.length > 170 ? n.description.substr(0, 170) + "..." : n.description}</div>
                            <div className={style.under}>
                              <div className={style.price}>{SlicePrice(n.price)} руб. в месяц</div>
                              <div className={style.more}>Узнать больше</div>
                            </div>
                          </div>
                        </a>
                })}
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    )
}

export default observer(Catalog);
