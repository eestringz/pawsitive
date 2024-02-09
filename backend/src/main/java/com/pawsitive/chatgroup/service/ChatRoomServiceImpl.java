package com.pawsitive.chatgroup.service;


import com.pawsitive.auth.Role;
import com.pawsitive.chatgroup.dto.request.ChatRoomCreateReq;
import com.pawsitive.chatgroup.dto.response.ChatRes;
import com.pawsitive.chatgroup.dto.response.ChatRoomListRes;
import com.pawsitive.chatgroup.dto.response.ChatRoomRes;
import com.pawsitive.chatgroup.entity.ChatRoom;
import com.pawsitive.chatgroup.exception.ChatRoomNotFoundException;
import com.pawsitive.chatgroup.repository.ChatRoomRepository;
import com.pawsitive.chatgroup.transfer.ChatGroupTransfer;
import com.pawsitive.common.dto.response.BaseResponseMessage;
import com.pawsitive.common.exception.InvalidRequestDataException;
import com.pawsitive.doggroup.entity.Dog;
import com.pawsitive.doggroup.service.DogService;
import com.pawsitive.surveygroup.dto.request.AppointmentReq;
import com.pawsitive.usergroup.service.UserService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final DogService dogService;
    private final UserService userService;

    /**
     * 채팅방을 생성
     *
     * @return 생성한 채팅방
     */
    @Override
    @Transactional
    public ChatRoomRes createChatRoom(ChatRoomCreateReq req, Authentication authentication) {
        ChatRoom room = new ChatRoom();

        int userNo = req.getUserNo();
        int dogNo = req.getDogNo();

        // 채팅방 생성 요청자가 보호소 회원이라면
        if (userService.getUserByUserNo(userNo).getRole().equals(Role.SHELTER)) {
            throw new InvalidRequestDataException("유효하지 않은 요청입니다.");
        }

        Optional<ChatRoom> existChatRoom =
            chatRoomRepository.findChatRoomByUserNoAndDogNo(userNo,
                dogNo);

        if (existChatRoom.isPresent()) {
            return ChatGroupTransfer.entityToDto(existChatRoom.get());
        }

        Dog dog = dogService.getDogEntityByDogNo(dogNo);

        room.setId(getRandomRoomNo());
        room.setName(dog.getUser().getName() + "보호소 - " + dog.getName());
        room.setDogNo(dogNo);
        room.setUserNo(userNo);
        ChatRoom chatRoom = chatRoomRepository.save(room);

        return ChatGroupTransfer.entityToDto(chatRoom);
    }

    private String getRandomRoomNo() {
        String roomNo = UUID.randomUUID().toString();
        roomNo = roomNo.replace("-", "");
        roomNo = roomNo.substring(0, 16);
        return roomNo;
    }

    @Override
    public ChatRoom getChatRoomEntityByChatRoomNo(int chatRoomNo) {
        return chatRoomRepository.findByChatRoomNo(chatRoomNo)
            .orElseThrow(ChatRoomNotFoundException::new);
    }

    /**
     * 채팅방 고유번호로 채팅 이력을 조회
     *
     * @param chatRoomNo 조회할 채팅방의 고유 번호
     * @return
     */
    @Override
    public List<ChatRes> getChatHistoryByChatRoomNo(int chatRoomNo) {
        return chatRoomRepository.getChatHistoryByChatRoomNo(chatRoomNo);
    }

    /**
     * !
     * 최근에 생성된 순으로 채팅방 전체 조회
     *
     * @return 최근에 생성된 순으로 조회한 채팅방 목록
     */
    @Override
    public List<ChatRoomListRes> getChatRoomList(int userNo) {
        List<ChatRoomListRes> chatRooms = chatRoomRepository.getChatRoomList(userNo);
        for (ChatRoomListRes chatRoom : chatRooms) {
            chatRoom.setLastChat(chatRoomRepository.getLastChat(chatRoom.getChatRoomNo()));
        }

        return chatRooms;
    }

    @Override
    public String createAppointment(AppointmentReq appointmentReq) {
        ChatRoom chatRoom = getChatRoomEntityByChatRoomNo(appointmentReq.getChatRoomNo());
        chatRoom.setPromiseCreatedAt(LocalDateTime.now());
        chatRoom.setIsPromiseAccepted(false);
        chatRoomRepository.save(chatRoom);
        return BaseResponseMessage.SUCCESS.getMessage();
    }

    @Override
    public String acceptAppointment(AppointmentReq appointmentReq) {
        ChatRoom chatRoom = getChatRoomEntityByChatRoomNo(appointmentReq.getChatRoomNo());
        chatRoom.setIsPromiseAccepted(true);
        chatRoomRepository.save(chatRoom);
        return BaseResponseMessage.SUCCESS.getMessage();
    }

}
