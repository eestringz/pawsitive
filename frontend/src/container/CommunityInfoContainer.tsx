import { useNavigate } from 'react-router-dom'
import CommunityListContainer from '@src/container/CommunityListContainer'
import * as c from '@src/container/style/CommunityListInfoContainerStyle'

const CommunityInfoContainer = () => {
  const navigate = useNavigate()

  const isMapChange = () => {
    navigate('/community/map')
  }

  const goCreateCommunity = () => navigate('/community/create')

  return (
    <c.Container>
      <c.Header>
        <c.HeaderButton type="button" onClick={isMapChange}>
          지도보기
        </c.HeaderButton>
        <c.CreateButton type="button" onClick={goCreateCommunity}>
          작성하기
        </c.CreateButton>
      </c.Header>

      <div>
        <CommunityListContainer />
      </div>
    </c.Container>
  )
}

export default CommunityInfoContainer
