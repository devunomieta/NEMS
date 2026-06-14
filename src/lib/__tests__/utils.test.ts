import { cn } from '../utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge tailwind classes correctly', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
      expect(cn('text-sm', { 'text-lg': true })).toBe('text-lg')
    })
    
    it('should handle undefined and null', () => {
      expect(cn('bg-red-500', undefined, null, false, 'text-center')).toBe('bg-red-500 text-center')
    })
  })
})
