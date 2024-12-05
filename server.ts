const UserData = [
    {
        id: "test",
        pw: "test",
        name: "test",
        phone: "test",
    },
];

const CalendarEvent: { id: string, title: string; date: string }[] = []; // Event 배열 초기화

import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(4000, () => {
    console.log("서버가 4000번 포트에서 활성화되었습니다.");
});

app.get("/idcheck/:id", (req, res) => {
    const id: string = req.params.id;
    const idcheck = UserData.some(user => user.id === id)
    res.send({ ok: !idcheck })
})

app.post("/signup", (req, res) => {
    const id: string = req.body.id;
    const pw: string = req.body.password;
    const name: string = req.body.name;
    const phone: string = req.body.phone;
    const idcheck = UserData.some(user => user.id === id)

    if (idcheck === true) {
        res.send({ ok: false })
    }
    else if (UserData) {
        UserData.push({
            id, pw, name, phone,
        });

        console.log("회원가입 완료 : ", UserData);
        res.send({ ok: true });
    } else {
        res.send({ ok: false });
    }
});

app.post("/login", (req, res) => {
    const { ID, password } = req.body;

    const user = UserData.find(
        (user) => user.id === ID && user.pw === password,
    );

    if (user) {
        res.send({
            ok: true,
            user: { ID: user.id, name: user.name }
        });
        console.log("로그인 성공");
    } else {
        res.send({ ok: false });
    }
});

app.get("/users", (req, res) => {
    res.send(UserData);
});


app.post("/registerDate", (req, res) => {
    const id: string = req.body.id
    const title: string = req.body.title;
    const date: string = req.body.date;
    if (CalendarEvent) {
        CalendarEvent.push({
            id, title, date
        });
        console.log("일정 등록 완료 : ", CalendarEvent);
        res.send({ ok: true });
    } else {
        res.send({ ok: false });
    }
})

app.put("/updateDate/:id", (req, res) => {
    const oldId: string = req.params.id; // URL 파라미터에서 기존 날짜 가져오기
    const { title, date: newDate } = req.body; // 요청 본문에서 제목과 새로운 날짜 가져오기

    const eventIndex = CalendarEvent.findIndex(event => event.id === oldId);
    if (eventIndex !== -1) {
        // 제목과 날짜 업데이트
        CalendarEvent[eventIndex].title = title;
        CalendarEvent[eventIndex].date = newDate; // 새로운 날짜로 업데이트
        console.log("일정 업데이트 완료 : ", CalendarEvent[eventIndex]);
        res.send({ ok: true, event: CalendarEvent[eventIndex] });
    } else {
        res.send({ ok: false, message: "일정을 찾을 수 없습니다." });
    }
});

// 일정 삭제
app.delete("/deleteDate/:id", (req, res) => {
    const id: string = req.params.id; // URL 파라미터에서 날짜 가져오기

    const eventIndex = CalendarEvent.findIndex(event => event.id === id);
    if (eventIndex !== -1) {
        const deletedEvent = CalendarEvent.splice(eventIndex, 1); // 삭제
        console.log("일정 삭제 완료 : ", deletedEvent);
        res.send({ ok: true });
    } else {
        res.send({ ok: false, message: "일정을 찾을 수 없습니다." });
    }
});



// 현재 존재하는 일정 확인
app.get("/events", (req, res) => {
    res.send(CalendarEvent); // CalendarEvent 배열 반환
});