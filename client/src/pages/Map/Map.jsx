import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';
import { observer } from 'mobx-react-lite'

import { YMaps, Map, ZoomControl, Placemark, Clusterer } from '@pbe/react-yandex-maps';
import Header from '../../utilities/Header/Header';

const MapC = () => {
  const {store} = useContext(Context)

  const [articles, setArticles] = useState([])

  useEffect(() => {
    const fetchData = async () => {
        const data = await store.getOffers();
        setArticles(data)
    }  
    fetchData();
  }, [])


    return (
      <div>
        <Header/>
        <YMaps>
          <Map 
          defaultState={{ center: [43.1202304400753, 131.88398824315811], 
            zoom: 12, 
            controls: ["zoomControl"] 
          }} 
          modules={["control.ZoomControl", "Placemark"]} 

          width={"100%"} height={"100vh"}>
              <ZoomControl options={{ float: "right" }} />
              <Clusterer>
                  {articles.map(n => {
                      return <Placemark defaultGeometry={[n.mapCordX, n.mapCordY]} id="1" onClick={(e => {
                          const coords = e.get("target").geometry._coordinates
                          let filteredArticle = articles.filter(n => {
                              return n.mapCordX == coords[0]
                          })

                          window.location.href = "/offers/" + filteredArticle[0].id
                      })}/>
                  })}
              </Clusterer>
          </Map>
        </YMaps>
      </div>
    )
}

export default observer(MapC);
