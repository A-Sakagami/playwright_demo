// ランダムに人名を創る
export function createRandomName():string{
    const familyName = ["佐藤","鈴木","田中","高橋","伊藤","渡辺","山崎","森","池田","橋本","阿部","石川","山下","中島","石井","小川","前田","岡田","長谷川","藤田","後藤","近藤","村上","遠藤","青木","坂本","斉藤","福田","太田","西村","藤井","金子","岡本","藤原"];
    const firstName = ["太郎","花子","聡","大翔","蓮","葵","陽葵","凛"];
    let name:string = '';
    // ランダムに名前を生成
    function getRandomElement(arr: string[]){
        return arr[Math.floor(Math.random() * arr.length)];
    }
    name = getRandomElement(familyName) + '　' + getRandomElement(firstName);

    return name;
}

// ランダムな文字列(8~20文字のパスワード)を作成する
export function createRandomPassword(minLength: number = 8, maxLength: number = 20):string{
    let password:string = '';
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const allCharacters = uppercaseLetters + lowercaseLetters + digits;

    // ランダムな文字列の長さを決定（8文字以上20文字以下）
    const randomLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

      // ランダムに文字を選んで文字列を作成
    for (let i = 0; i < randomLength; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        password += allCharacters[randomIndex];
    }

    return password;
}