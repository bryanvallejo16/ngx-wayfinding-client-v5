import DataSource from './data_source';
import Feature, { FeatureCollection } from '../models/feature.model';

export default class GeoJSONSource extends DataSource {
  language = 'en';

  constructor(features: FeatureCollection) {
    super('main');
  }

  fetch(data) {
    this.data = new FeatureCollection(data);
    this.mapLanguage();
  }

  mapLanguage() {
    const features = this.data.features.filter(f => typeof f.properties.title_i18n === 'object');
    features.forEach(feature => this.mapFeatureLanguage(feature, this.language));
  }

  mapFeatureLanguage(feature: Feature, language: string) {
    if (typeof feature.properties.title_i18n === 'string') {
      feature.properties.title_i18n = JSON.parse(feature.properties.title_i18n);
    }

    if (typeof feature.properties.title_i18n === 'object') {
      feature.properties.title = feature.properties.title_i18n[language];
    }
  }

  query(query: string, level = 0) {
    return this.data.features
      .filter(f => f.properties.title && f.properties.title.toLowerCase().match(query.toLowerCase()));
  }

  get(id: string) {
    return this.data.features.find(f => f.id === id) as Feature;
  }

  getInternal(id: string) {
    return this.data.features.find(f => f.properties.id === id) as Feature;
  }

  get collection() {
    return {
      type: 'FeatureCollection',
      features: this.data.features.map(f => f.json)
    } as FeatureCollection;
  }
}
