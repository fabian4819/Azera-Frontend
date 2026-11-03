/** Cek satu-jalan: `npx tsx scripts/links.check.ts` */
import assert from 'node:assert';
import { profileUrlFor, toUrl } from '../src/lib/links';

assert.equal(profileUrlFor('TikTok', '@cheesekraft26'), 'https://tiktok.com/@cheesekraft26');
assert.equal(profileUrlFor('Instagram', '@nianadyanikitha_'), 'https://instagram.com/nianadyanikitha_');
assert.equal(profileUrlFor('Followers TikTok', '2365'), null);
assert.equal(profileUrlFor('TikTok', ''), null);
assert.equal(toUrl('instagram.com/agency'), 'https://instagram.com/agency');
assert.equal(toUrl('https://drive.google.com/x'), 'https://drive.google.com/x');
assert.equal(toUrl('Rp10.000'), null);
assert.equal(toUrl('a@b.com'), null);
assert.equal(toUrl('Mars MG'), null);
assert.equal(toUrl('javascript:alert(1)'), null);
console.log('ok');
