import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
export class App {
  sorular = [
    {
      soru: 'Siyah ile aynı anlama gelen bir renk.',
      cevap: 'KARA',
      soruldu: false
    },
    {
      soru: 'Sık kullanılan bir isim.',
      cevap: 'AHMET',
      soruldu: false
    },
    {
      soru: "Türkiye'nin başkenti",
      cevap: 'ANKARA',
      soruldu: false
    },
    {
      soru: 'Karadenizde bir ilimiz',
      cevap: 'TRABZON',
      soruldu: false
    }
  ];
  mesaj = null;
  mesajClass = '';
  mesajSure = null;
  mevcutSoru = null;
  harfler = [];
  puan = 0;
  harfPuan = 0;
  yarismaciCevap = '';
  tamamlandi = false;
  sure = null;
  kalanSure = 0;

  mesajGoster(msg, tur) {
    if (this.mesajSure) {
      clearTimeout(this.mesajSure);
      this.mesajSure = null;
    }
    this.mesaj = msg;
    if (tur === 'hata') {
      this.mesajClass = 'bg-danger text-white';
    } else if (tur === 'basari') {
      this.mesajClass = 'bg-success text-white';
    } else {
      this.mesajClass = 'bg-dark text-white';
    }
    this.mesajSure = setTimeout(() => {
      this.mesaj = null;
    }, 3000);
  }

  basla() {
    this.tamamlandi = false;
    this.mevcutSoru = null;
    this.puan = 0;
    this.sorular.map(x => {
      x.soruldu = false;
    });
    this.kalanSure = 240;
    this.sure = setInterval(() => {
      this.kalanSure--;
      if (this.kalanSure === 0) {
        this.bitir();
      }
    }, 1000);
    this.soruVer();
    this.mesajGoster('İyi yarışmalar!');
  }

  bitir() {
    clearInterval(this.sure);
    this.mevcutSoru = null;
    this.tamamlandi = true;
  }
  soruVer() {
    this.yarismaciCevap = '';
    this.mevcutSoru = this.sorular.find(x => !x.soruldu);
    if (!this.mevcutSoru) {
      this.bitir();
      return;
    }
    this.harfler = [];
    this.mevcutSoru.cevap.split('').map(x => {
      this.harfler.push({
        harf: x,
        acildi: false
      });
    });
    this.harfPuan = this.harfler.length * 100;
    this.mevcutSoru.soruldu = true;
  }
  harfVer() {
    if (this.harfPuan <= 100) {
      return;
    }

    let rastgeleHarfIndex = Math.floor(Math.random() * this.harfler.length);
    let harf = this.harfler[rastgeleHarfIndex];
    while (harf.acildi) {
      rastgeleHarfIndex = Math.floor(Math.random() * this.harfler.length);
      harf = this.harfler[rastgeleHarfIndex];
    }
    harf.acildi = true;
    this.harfler = [...this.harfler];
    this.harfPuan -= 100;
  }
  cevapVer() {
    if (!this.yarismaciCevap.length) {
      return;
    }

    if (this.yarismaciCevap.length !== this.harfler.length) {
      this.mesajGoster('Harf sayıları tutmuyor!');
      return;
    }

    let cevap = this.yarismaciCevap.toLocaleUpperCase('tr');
    this.yarismaciCevap = cevap;

    if (this.yarismaciCevap === this.mevcutSoru.cevap.toLocaleUpperCase('tr')) {
      this.puan += this.harfPuan;
      this.mesajGoster('Tebrikler, doğru bildiniz!', 'basari');
    } else {
      this.puan -= this.harfPuan;
      this.mesajGoster(
        `Yanlış cevap, doğrusu '${this.mevcutSoru.cevap}' olmalıydı!`,
        'hata'
      );
    }

    this.soruVer();
  }
}
