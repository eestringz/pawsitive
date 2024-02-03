import * as c from '@src/components/style/CommunityListItemStyle'
import { CommunityItemType } from '@src/types/components/CommunityType'

interface CommunityProps {
  data: CommunityItemType
}

const CommunityCard = (props: CommunityProps) => {
  const { data } = props

  const setImageSrc = (category: string) => {
    switch (category) {
      case '지식쌓개':
        return '/img/img_dog_food.png'
      case '자랑하개':
        return '/img/img_dog_house.png'
      case '영양있개':
        return '/img/img_bone_bowl.png'
      case '쇼핑하개':
        return '/img/img_dog_medication.png'
      default:
        return '/img/img_main_house.png'
    }
  }

  return (
    <c.Container>
      <img src={setImageSrc(data.communityCategoryName)} alt="" />
      <c.Right>
        <c.Category>{data.communityCategoryName}</c.Category>
        <c.Title>{data.title}</c.Title>
        <c.Desc>{data.content}</c.Desc>
      </c.Right>
    </c.Container>
  )
}

export default CommunityCard
