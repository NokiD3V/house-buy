import React, { useContext, useEffect, useState } from 'react';
import style from './style/startpage.module.scss'
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import Header from '../../utilities/Header/Header';
import Loader from '../../utilities/Loader/Loader';
import { useForm } from 'react-hook-form';


import banner from './assets/banner.png'
import map_img from './assets/map.png'
import recommend_pic from './assets/pic.png'
import good from './assets/good.svg'
import Footer from '../../utilities/Footer/Footer';
import { useNavigate } from 'react-router-dom';

/**
 * @description Default home page for info about project, Figma-file in README.md
 */

const StartPage = () => {
    const {store} = useContext(Context)

    const [articles, setArticles] = useState([])

    const navigate = useNavigate()

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
            <div className={style.wrapper}>
                <Header/>
                <div className={style.content}>
                    <div className={style.banner}><img src={banner}/></div>
                    <div className={style.filter}>
                        <div className={style.title}>Фильтр</div>
                        <form onSubmit={handleSubmit((data) => {
                            let link = "/catalog?"
                            if(data.location) link += "location=" + data.location + "&"
                            if(data.min) link += "min=" + data.min + "&"
                            if(data.max) link += "max=" + data.max + "&"
                            if(data.type) link += "type=" + data.type + "&"
          
                            navigate(link)
                        })}>
                            <div className={style.types}>
                                <div className={style.price}>
                                    <div className={style.price__title}>Цена</div>
                                    {errors.max || errors.min ? <div className={style.price__error}>Введите корректные числа!</div> : null}
                                    <div className={style.price__select}>
                                        <div className={style.price__input__min}>Минимально<input type="number" placeholder='0 руб.' min={0} {...register('min', { pattern: /\d+/, min:0 })}/></div>
                                        <div className={style.price__input__max}>Максимально<input type="number" placeholder='>100.000 руб.' min={0} {...register('max', { pattern: /\d+/, maxLength: 7 })}/></div>
                                    </div>
                                </div>
                                <div className={style.type}>
                                    <div className={style.type__title}>Тип недвижимости</div>
                                    <div className={style.type__buttons}>
                                        <div className={style.type__input}><input id='home' type="radio" value={"home"} name='type' {...register('type')}/><label htmlFor='home'>Дом</label></div>
                                        <div className={style.type__input}><input id='flat' type="radio"value={"flat"}  name='type' {...register('type')}/><label htmlFor='flat'>Квартира</label></div>
                                        <div className={style.type__input}><input id='other' type="radio" value={"other"} name='type' {...register('type')}/><label htmlFor='other'>Другое</label></div>
                                    </div>
                                </div>

                            </div>
                            <div className={style.location}>
                                <div className={style.location__name}>Местоположение</div>
                                <div className={style.location__input}><input type="text" placeholder='Введите адрес...' {...register('location')}/></div>
                            </div>
                            <input type="submit" className={style.search__btn} value="Искать" />
                        </form>
                    </div> 
                    <div className={style.map__section}>
                        <div className={style.map__title}>Найди квартиру на карте</div>
                        <a href='#'><img src={map_img} className={style.map__img} /></a>
                    </div>
                    <div className={style.recommend__section}>
                        <div className={style.recommend__title}>Вам рекомендованно</div>
                        <div className={style.recommend__links}>
                            {
                                articles.slice(0, 4).map(n => {
                                    return <div className={style.recommend__link__item}>
                                        <a href={`/offers/${n.id}`}>
                                            <img src={n.imgURL || recommend_pic} />
                                            <div className={style.item__title}>{ n.type == "flat" ? "Квартира" : (n.type == "house" ? "Дом" : "Другое" )}</div>
                                            <div className={style.item__price}>{SlicePrice(n.price)} рублей / месяц</div>
                                            <div className={style.adress}>{n.adress}</div>
                                        </a>
                                    </div>
                                })
                            }

                        </div>
                    </div>
                    <div className={style.goods}>
                        <div className={style.goods__title}>Почему мы?</div>
                        <div className={style.goods__list}>
                            <div className={style.good__item}>
                                <img src={good}/>
                                <div className={style.good__label}>Качественное обслуживание</div>
                            </div>
                            <div className={style.good__item}>
                                <img src={good}/>
                                <div className={style.good__label}>Качественное обслуживание</div>
                            </div>
                            <div className={style.good__item}>
                                <img src={good}/>
                                <div className={style.good__label}>Качественное обслуживание</div>
                            </div>
                            <div className={style.good__item}>
                                <img src={good}/>
                                <div className={style.good__label}>Качественное обслуживание</div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
            
    );
}

export default observer(StartPage);