import { EventBridge } from 'aws-sdk';
import { IMessageBroker, IRequestMessage, IRequestMessages, IResponseMessage, IResponseMessages } from "../types/interfaces";

export class AwsEventBridge implements IMessageBroker {

  private eventBridge;

  constructor(config: any = {}) {
    let conf = {
      apiVersion: '2015-10-07',
      ...config
    };
    this.eventBridge = new EventBridge(conf);
  }

  sendMessage(messageDetail: IRequestMessage): Promise<IResponseMessage> {
    return this.sendMessages({Messages: [messageDetail]})
      .then(res => {
        let responseMessage: IResponseMessage = {};
        responseMessage.EntryId = JSON.stringify(res);
        return responseMessage;
      });
  }

  sendMessages(messageDetails: IRequestMessages): Promise<IResponseMessages> {
    let putEventsRequest: EventBridge.PutEventsRequest;
    putEventsRequest = {
      Entries: messageDetails.Messages.map(ev => {
        return {
          Details: ev.Detail,
          DetailType: ev.DetailType,
          Source: ev.Source
        };
      })
    };

    return this.eventBridge.putEvents(putEventsRequest).promise()
      .then(res => {
        let response: IResponseMessages = {
          FailedEntryCount: 0,
          Messages: []
        };
        response.FailedEntryCount = res.FailedEntryCount;
        response.Messages = res.Entries?.map(ent => {
          let entry: IResponseMessage = {
            EntryId: ent.EventId
          }
          return entry;
        });
        return response;
      })
  }
}
