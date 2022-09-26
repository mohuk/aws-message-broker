export interface IMessageBroker {
  sendMessage(messageDetail: IRequestMessage): Promise<IResponseMessage>;
  sendMessages(messageDetails: IRequestMessages): Promise<IResponseMessages>;
}

export interface IRequestMessage {
  Detail: any,
  DetailType: string,
  Source?: string
}

export interface IRequestMessages {
  Messages: Array<IRequestMessage>
}


export interface IResponseMessage {
  EntryId?: string
}


export interface IResponseMessages {
  FailedEntryCount?: number,
  Messages?: Array<IResponseMessage>
}


