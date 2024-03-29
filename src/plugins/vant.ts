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
    Checkbox,
    Skeleton,
    Radio,
    RadioGroup,
    Toast,
    Divider,
    Button,
    Steps,
    Step,
    CountDown,
    Popup,
    ImagePreview,
    Form,
    Picker,
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
    app.use(Skeleton);
    app.use(Radio);
    app.use(RadioGroup);
    app.use(Toast);
    app.use(Divider);
    app.use(Button);
    app.use(Steps);
    app.use(Step);
    app.use(CountDown);
    app.use(Popup);
    app.use(ImagePreview);
    app.use(Overlay);
    app.use(Form);
    app.use(Picker);
}
