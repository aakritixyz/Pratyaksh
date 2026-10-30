import {describe,it,expect} from 'vitest';
import {fixtureFindings,findingSchema,classification,tone} from './model';
describe('Forensic result contract',()=>{
 it('validates every fixture',()=>fixtureFindings.forEach(f=>expect(findingSchema.safeParse(f).success).toBe(true)));
 it('never treats unavailable as clean',()=>{const f=fixtureFindings.find(f=>f.execution_status==='unsupported')!;expect(classification(f)).toBe('Unavailable');expect(tone(f)).toBe('unavailable');expect(f.result).toBeNull()});
 it('keeps integrity separate from synthesis conclusions',()=>{const f=fixtureFindings.find(f=>f.category==='integrity')!;expect(classification(f)).toBe('Unchanged since intake');expect(f.result).toBeNull()});
 it('labels uncalibrated scores accurately',()=>{fixtureFindings.filter(f=>f.score).forEach(f=>{expect(f.score!.calibration_status).toBe('Not calibrated');expect(f.score!.interpretation).toBe('Raw model score')})});
 it('rejects fabricated certainty labels',()=>{expect(findingSchema.safeParse({...fixtureFindings[0],result:'genuine'}).success).toBe(false)});
});
