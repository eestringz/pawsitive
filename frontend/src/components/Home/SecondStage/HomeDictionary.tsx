import * as h from '@src/components/style/HomeDictionaryStyle'
import LightColorMoveCard from '@src/common/LightColorMoveCard'
import { useNavigate } from 'react-router-dom'

const HomeDictionary = () => {
  const navigate = useNavigate()

  const cardClick = (num: number) => {
    navigate(`/dictionary/${num}`)
  }

  return (
    <h.Container>
      <h.SubTitle>펫과사전 행동교육</h.SubTitle>
      <h.Title>다양한 활동들을 미리 알아봐요!</h.Title>
      <h.Wrap>
        <h.Item onClick={() => cardClick(1)}>
          <img alt="" src="/img/img_popular_community.png" />
          <h.ItemTitle>산책활동</h.ItemTitle>
        </h.Item>
        <h.Item onClick={() => cardClick(3)}>
          <img alt="" src="/img/img_show_dog_card.png" />
          <h.ItemTitle>켄넬교육</h.ItemTitle>
        </h.Item>
        <h.Item onClick={() => cardClick(8)}>
          <img alt="" src="/img/img_dog_poo.png" />
          <h.ItemTitle>배변교육</h.ItemTitle>
        </h.Item>
        <h.Item onClick={() => cardClick(9)}>
          <img alt="" src="/img/img_dog_medication.png" />
          <h.ItemTitle>투약방법</h.ItemTitle>
        </h.Item>
      </h.Wrap>
      <LightColorMoveCard title="더 많은 펫과사전 찾아보기" url="/dictionary" />
    </h.Container>
  )
}

export default HomeDictionary
