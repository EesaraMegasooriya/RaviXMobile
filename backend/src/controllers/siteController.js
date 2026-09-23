import SiteSettings from '../models/SiteSettings.js';
import { isImageUrl } from '../utils/validation.js';

export async function getSettings(req, res, next) {
  try {
    const settings = await SiteSettings.findById('homepage');
    res.json({ success: true, settings: { heroImageUrl: settings?.heroImageUrl || '' } });
  } catch (error) { next(error); }
}
export async function updateSettings(req, res, next) {
  try {
    const value = req.body?.heroImageUrl;
    if (typeof value !== 'string' || (value.trim() !== '' && !isImageUrl(value.trim()))) {
      return res.status(400).json({ success: false, message: 'Enter a valid HTTP or HTTPS image link, or leave it empty to restore the default.' });
    }
    const settings = await SiteSettings.findByIdAndUpdate('homepage', { $set: { heroImageUrl: value.trim() } }, { upsert: true, returnDocument: "after", runValidators: true });
    res.json({ success: true, settings: { heroImageUrl: settings.heroImageUrl } });
  } catch (error) { next(error); }
}
