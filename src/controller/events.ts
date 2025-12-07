// events interface [message name : message content]
interface IMessage {
    playShow: undefined;
    pauseShow: undefined;
    fineForwardShow: undefined;
    stepForwardShow: undefined;
    fastForwardShow: undefined;
    fineBackwardShow: undefined;
    stepBackwardShow: undefined;
    fastBackwardShow: undefined;

    selectPrevRow: undefined;
    selectNextRow: undefined;

    copySelectedKeyframes: undefined;
    pasteCopiedKeyframes: undefined;

    deleteSelectedKeyframes: undefined;
    saveCurrentKeyframe: undefined;
}

export type EventKey = keyof IMessage;

/**
 * The function dispatches a custom event with an optional message body.
 * @param {T} eventName - The `eventName` parameter is the name of the event that you want to dispatch.
 * It should be of type `EventKey`, which likely represents a specific event name or type.
 * @param [body] - The `body` parameter in the `dispatchEvent` function is an optional parameter that
 * represents the data or message associated with the event being dispatched. It is a generic type
 * `IMessage[T]`, where `T` is a specific event key that determines the type of data that can be passed
 * as
 */
export function dispatchCustomEvent<T extends EventKey>(eventName: T, body?: IMessage[T]) {
    const event = new CustomEvent(eventName, { detail: body });
    window.dispatchEvent(event);
}

/**
 * The function `listenToCustomEvent` listens for a specific event and executes a callback function with the
 * event's message body as an argument.
 * @param {T} eventName - The `eventName` parameter is the type of event that the function will listen
 * to. It is a generic type `T` that extends `EventKey`, which likely represents the type of event key
 * or name that can be listened for.
 * @param callback - The `callback` parameter is a function that takes a single argument `body`, which
 * is of type `IMessage[T]`. This means that the `callback` function should expect to receive an object
 * of type `IMessage[T]` as its argument when it is called.
 */
export function listenToCustomEvent<T extends EventKey>(eventName: T, callback: (body: IMessage[T]) => any) {
    window.addEventListener(eventName, (e) => {
        // @ts-ignore
        callback(e.detail as IMessage[T]);
    });
}