export interface DeserializeMapper<Deserialized, Serialized> {
  deserialize(serialized: Serialized, ...args: any[]): Deserialized;
}

export interface SerializeMapper<Deserialized, Serialized> {
  serialize(deserialized: Deserialized, ...args: any[]): Serialized;
}

export interface Mapper<Deserialized, Serialized>
  extends SerializeMapper<Deserialized, Serialized>,
    DeserializeMapper<Deserialized, Serialized> {}
