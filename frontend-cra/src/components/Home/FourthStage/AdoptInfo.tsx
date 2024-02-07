import * as a from '../_style/AdoptInfoStyle'

const AdoptInfo = () => {
  // const { isLoading } = useQuery<AfterAdoptionUserInfo>({
  //   queryKey: ['afterAdoptionUser'],
  //   queryFn: fetchAfterAdoptionUser,
  // })

  return (
    <a.Container>
      <>
        <a.DogImage src="img/image_sample_dog.png" />
        <a.TextContainer>
          <a.TogetherContainer>
            <a.DogName>머꾸꾸</a.DogName>
            <a.Together>와 함께한지</a.Together>
          </a.TogetherContainer>
          <a.Day> 290일</a.Day>
        </a.TextContainer>
      </>
    </a.Container>
  )
}

export default AdoptInfo