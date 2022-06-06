module.exports = {
    isEmail: (value) => {

        let [localpart, domain, ...etc] = value.split('@');

        if (!localpart || !domain || etc.length) {
            return false;
        } else if (value.includes(' ')) {
            return false;
        } else if (value[0] === '-') {
            return false;
        } else if (!/^[0-9a-zA-z+_-]+$/gi.test(localpart)) {
            return false;
        } else if (!/^[0-9a-zA-z-.]+$/gi.test(domain)) {
            return false;
        }

        // value가 이메일 형식에 맞으면 true, 형식에 맞지 않으면 false를 return 하도록 구현해보세요
        return true;
    },
};