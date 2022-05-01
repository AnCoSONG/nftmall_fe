import { App } from "vue";

import {
    Icon,
    ConfigProvider,
    NoticeBar,
    Swipe,
    SwipeItem,
    Loading,
    Overlay,
    Image,
    Lazyload,
    Tab,
    Tabs,
    PullRefresh,
    List,
    Dialog,
    Empty,
    CellGroup,
    Cell,
    Field,
    PasswordInput,
    NumberKeyboard,
    Checkbox
} from "vant";

export default function (app: App) {
    app.use(Icon);
    app.use(ConfigProvider);
    app.use(NoticeBar);
    app.use(Swipe);
    app.use(SwipeItem);
    app.use(Loading);
    app.use(Overlay);
    app.use(Image);
    app.use(Lazyload);
    app.use(Tabs);
    app.use(Tab);
    app.use(PullRefresh);
    app.use(List);
    app.use(Dialog);
    app.use(Empty);
    app.use(CellGroup);
    app.use(Cell);
    app.use(Field);
    app.use(PasswordInput);
    app.use(NumberKeyboard);
    app.use(Checkbox);
}
