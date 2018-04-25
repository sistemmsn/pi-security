import { MomentDatePipe } from './moment/moment-date';

import { NgModule } from '@angular/core';
import { FromNowPipe } from './moment/from-now';

@NgModule({
	declarations: [FromNowPipe, MomentDatePipe],
	imports: [],
	exports: [FromNowPipe, MomentDatePipe]
})
export class PipesModule {}
