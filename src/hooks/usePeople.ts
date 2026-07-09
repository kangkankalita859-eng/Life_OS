import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/db/dexie';
import { Person } from '@/types';
import { generateId } from '@/lib/utils';

export function usePeople() {
  const queryClient = useQueryClient();

  // Get all people
  const peopleQuery = useQuery({
    queryKey: ['people'],
    queryFn: () => db.people.toArray(),
  });

  // Get person by ID
  const usePerson = (id: string) => {
    return useQuery({
      queryKey: ['people', id],
      queryFn: () => db.people.get(id),
    });
  };

  // Create person
  const createPerson = useMutation({
    mutationFn: async (personData: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newPerson: Person = {
        ...personData,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.people.add(newPerson);
      return newPerson;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });

  // Update person
  const updatePerson = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Person> }) => {
      const updatedData = {
        ...data,
        updatedAt: new Date(),
      };
      await db.people.update(id, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });

  // Delete person
  const deletePerson = useMutation({
    mutationFn: async (id: string) => {
      await db.people.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });

  return {
    peopleQuery,
    usePerson,
    createPerson,
    updatePerson,
    deletePerson,
  };
}
