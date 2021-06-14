import countriesList from 'i18n-iso-countries/langs/ru.json';
import { countryListTransform } from './util';

export default {
  countries: countryListTransform(countriesList),
  format: {
    decimalSymbol: '.',
    groupSymbol: ',',
  },
  date: {
    mon: 'понедельник',
    tue: 'вторник',
    wed: 'среда',
    thu: 'четверг',
    fri: 'пятница',
    sat: 'суббота',
    sun: ' воскресенье',
  },
  addresses: {
    line1: '{{street}}',
    line2: '{{street2}}',
    line3: '{{city}}, {{postalCode}}',
    tel: 'Tel.:',
  },
  errors: {
    unknown: 'Не удалось отправить бронирование',
    validation: {
      isRequired: 'Поле обязательно',
      isEmail: 'Поле должно быть действительным адресом электронной почты',
      isPhone: 'Поле должно быть действительным номером телефона',
    },
  },
  storeList: {
    title: 'Найти магазин рядом с вами',
    emptyList: 'В вашем местоположении не найдено ближайших магазинов',
    quantity: 'Количество',
    uncollapse: 'Показать информацию о магазине',
    collapse: 'Скрыть информацию о магазине',
    reserve: 'Резерв',
    select: 'Выбрать',
    comingSoon: ' Скоро будет',
    location: {
      address: ' Адрес',
      storeHours: 'Часы работы магазина',
      directions: ' Направления',
    },
    search: {
      label: 'Почтовый индекс',
      countryLabel: 'Страна',
      buttonLabel: 'Поиск',
    },
    inventory: {
      available: 'доступно',
      unavailable: 'Недоступен',
      exact: 'Доступно ({{x}})',
      rough: 'Доступно ({{x}}+)',
    },
  },
  reserveButton: {
    title: 'Зарезервировать и забрать',
  },
  reserve: {
    title: 'Отправить резерв',
    changeStore: ' Магазин изменений',
    contactInfo: 'Контактная информация о бронировании',
    pickupQuestion: 'Кто заберет эту бронь?',
    me: 'Me',
    someoneElse: 'Кто-то другой',
    pickupInfo: 'Кто заберет эту бронь?',
    firstName: 'Имя',
    lastName: ' Фамилия',
    phoneNumber: ' Номер телефона',
    email: 'Адрес электронной почты',
    submit: 'Отправить бронь',
    terms: {
      text: 'Я прочитал и принял условия {{child}}',
      link: 'условия',
    },
    privacy: {
      text: 'Я прочитал и принял {{child}}',
      link: 'политика конфиденциальности',
    },
  },
  success: {
    title: 'Подтверждение бронирования',
    headline: 'Спасибо за ваше бронирование',
    text: 'Мы отправим вам электронное/текстовое сообщение в ближайшее время, когда ваша бронь будет готова к получению',
    reservationNumber: 'Номер вашей брони:',
    location: {
      address: 'Адрес',
      phone: 'Телефон',
      storeHours: 'Часы работы магазина',
      directions: ' Направления',
    },
  },
  liveInventory: {
    searchPostalCode: 'Показать наличие в ближайших магазинах',
    searchDirect: 'Показать наличие в вашем магазине',
    postalCode: 'Почтовый индекс',
    reserveOther: 'Проверить другие магазины',
    find: 'Найти магазин',
    yourStore: 'Ваш магазин:',
    change: 'Изменить',
    select: 'Выберите магазин',
    pleaseSelect: 'Пожалуйста, выберите магазин',
    cancel: 'Отменить',
    list: {
      unavailable: '(недоступен)',
      comingSoon: '(Coming Soon)',
    },
  },
};
