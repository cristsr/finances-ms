import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';

export function optTransformer(
  opt: Partial<ValueTransformer>,
): ValueTransformer {
  return {
    to: opt.to || ((value) => value),
    from: opt.from || ((value) => value),
  };
}
