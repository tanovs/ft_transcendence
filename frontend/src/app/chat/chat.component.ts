import {Component, OnInit} from '@angular/core';
import io from 'socket.io-client';
import {BACKEND_ADDRESS} from "../../environments/environment";
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{
  name = ''
  text = ''
  socket: any
  messages: MyMessage[] = []
  title = 'NestJS-Angular Chat на вебсокетах'

  constructor() {
  }

  ngOnInit(): void {
    this.socket = io(BACKEND_ADDRESS)
    this.socket.on('msgToClient', (msg: MyMessage) => {
      this.receivedMessage(msg)
    })
  }

  validateInput() {
    return this.name.length > 0 && this.text.length > 0
  }

  sendMessage() {
    if(this.validateInput()) {
      const msg = {
        date: new Date().toLocaleString(),
        name: this.name,
        text: this.text
      }
      this.socket.emit('msgToServer', msg)
      this.text = ''
    }

  }

  receivedMessage(msg: MyMessage) {
    this.messages.push(msg)
  }
}

interface MyMessage {
  date: Date,
  name: string,
  text: string
}
