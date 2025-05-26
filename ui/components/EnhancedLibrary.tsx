"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  FileText,
  CheckSquare,
  Square,
  Trash2,
  Edit,
  Save,
  X,
  Archive,
  Filter,
  Calendar,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface LibraryNote {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  color?: string;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
}

interface TodoList {
  id: string;
  title: string;
  items: TodoItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface EnhancedLibraryProps {
  sendMessage: (message: string) => void;
  recentSearches?: string[];
  onRecentSearchClick?: (query: string) => void;
}

const EnhancedLibrary: React.FC<EnhancedLibraryProps> = ({ sendMessage, recentSearches, onRecentSearchClick }) => {
  const [notes, setNotes] = useState<LibraryNote[]>([]);
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"notes" | "todos">("notes");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoItem, setNewTodoItem] = useState("");

  // Load data from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("futuresearch_notes");
    const savedTodos = localStorage.getItem("futuresearch_todos");
    
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error("Error loading notes:", error);
      }
    }
    
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos).map((todoList: any) => ({
          ...todoList,
          createdAt: new Date(todoList.createdAt),
          updatedAt: new Date(todoList.updatedAt),
          items: todoList.items.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            dueDate: item.dueDate ? new Date(item.dueDate) : undefined
          }))
        }));
        setTodoLists(parsedTodos);
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("futuresearch_notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("futuresearch_todos", JSON.stringify(todoLists));
  }, [todoLists]);

  // Note functions
  const createNote = () => {
    if (!newNoteTitle.trim()) return;
    
    const newNote: LibraryNote = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      color: "white"
    };
    
    setNotes(prev => [newNote, ...prev]);
    setNewNoteTitle("");
    setNewNoteContent("");
  };

  const updateNote = (id: string, updates: Partial<LibraryNote>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
    setEditingNote(null);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  // Todo functions
  const createTodoList = () => {
    if (!newTodoTitle.trim()) return;
    
    const newTodoList: TodoList = {
      id: Date.now().toString(),
      title: newTodoTitle,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setTodoLists(prev => [newTodoList, ...prev]);
    setNewTodoTitle("");
  };

  const addTodoItem = (listId: string) => {
    if (!newTodoItem.trim()) return;
    
    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: newTodoItem,
      completed: false,
      createdAt: new Date(),
      priority: 'medium'
    };
    
    setTodoLists(prev => prev.map(list => 
      list.id === listId 
        ? { 
            ...list, 
            items: [...list.items, newItem],
            updatedAt: new Date()
          }
        : list
    ));
    setNewTodoItem("");
  };

  const toggleTodoItem = (listId: string, itemId: string) => {
    setTodoLists(prev => prev.map(list => 
      list.id === listId 
        ? {
            ...list,
            items: list.items.map(item =>
              item.id === itemId 
                ? { ...item, completed: !item.completed }
                : item
            ),
            updatedAt: new Date()
          }
        : list
    ));
  };

  const deleteTodoItem = (listId: string, itemId: string) => {
    setTodoLists(prev => prev.map(list => 
      list.id === listId 
        ? {
            ...list,
            items: list.items.filter(item => item.id !== itemId),
            updatedAt: new Date()
          }
        : list
    ));
  };

  const deleteTodoList = (id: string) => {
    setTodoLists(prev => prev.filter(list => list.id !== id));
  };

  // Filter data
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTodoLists = todoLists.filter(list =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    list.items.some(item => item.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <h1 className="text-3xl font-light text-black mb-2">Library</h1>
          <p className="text-gray-600">Your personal workspace for notes and tasks</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search notes and todos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>
        </motion.div>

        {/* Recent Global Searches */}
        {recentSearches && recentSearches.length > 0 && onRecentSearchClick && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="mb-6"
          >
            <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Global Searches</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((searchTerm, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-600 text-xs h-auto py-1 px-2.5"
                  onClick={() => onRecentSearchClick(searchTerm)}
                >
                  {searchTerm}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "notes" | "todos")}>
            <TabsList className="bg-gray-100 border-0">
              <TabsTrigger value="notes" className="data-[state=active]:bg-black data-[state=active]:text-white">
                <FileText className="w-4 h-4 mr-2" />
                Notes ({notes.length})
              </TabsTrigger>
              <TabsTrigger value="todos" className="data-[state=active]:bg-black data-[state=active]:text-white">
                <CheckSquare className="w-4 h-4 mr-2" />
                Todos ({todoLists.length})
              </TabsTrigger>
            </TabsList>

            {/* Notes Tab */}
            <TabsContent value="notes" className="mt-6">
              {/* Add Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-6"
              >
                <Card className="p-4 border border-gray-200">
                  <div className="space-y-3">
                    <Input
                      placeholder="Note title..."
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="border-0 text-lg font-medium placeholder:text-gray-400 focus-visible:ring-0"
                    />
                    <Textarea
                      placeholder="Start writing..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="border-0 resize-none min-h-[100px] placeholder:text-gray-400 focus-visible:ring-0"
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={createNote}
                        disabled={!newNoteTitle.trim()}
                        className="bg-black text-white hover:bg-gray-800"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Note
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Notes Grid */}
              <AnimatePresence>
                {filteredNotes.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Archive className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No notes yet. Create your first note above.</p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotes.map((note, index) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        index={index}
                        isEditing={editingNote === note.id}
                        onEdit={() => setEditingNote(note.id)}
                        onSave={(updates) => updateNote(note.id, updates)}
                        onCancel={() => setEditingNote(null)}
                        onDelete={() => deleteNote(note.id)}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* Todos Tab */}
            <TabsContent value="todos" className="mt-6">
              {/* Add Todo List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-6"
              >
                <Card className="p-4 border border-gray-200">
                  <div className="flex space-x-3">
                    <Input
                      placeholder="Todo list title..."
                      value={newTodoTitle}
                      onChange={(e) => setNewTodoTitle(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && createTodoList()}
                      className="border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
                    />
                    <Button 
                      onClick={createTodoList}
                      disabled={!newTodoTitle.trim()}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create List
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Todo Lists */}
              <AnimatePresence>
                {filteredTodoLists.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No todo lists yet. Create your first list above.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {filteredTodoLists.map((todoList, index) => (
                      <TodoListCard
                        key={todoList.id}
                        todoList={todoList}
                        index={index}
                        newTodoItem={newTodoItem}
                        setNewTodoItem={setNewTodoItem}
                        onAddItem={() => addTodoItem(todoList.id)}
                        onToggleItem={(itemId) => toggleTodoItem(todoList.id, itemId)}
                        onDeleteItem={(itemId) => deleteTodoItem(todoList.id, itemId)}
                        onDeleteList={() => deleteTodoList(todoList.id)}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

// Note Card Component
const NoteCard: React.FC<{
  note: LibraryNote;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<LibraryNote>) => void;
  onCancel: () => void;
  onDelete: () => void;
}> = ({ note, index, isEditing, onEdit, onSave, onCancel, onDelete }) => {
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleSave = () => {
    onSave({ title: editTitle, content: editContent });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      layout
    >
      <Card className="p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 group h-full">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="border-0 text-lg font-medium focus-visible:ring-0"
            />
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="border-0 resize-none min-h-[120px] focus-visible:ring-0"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={handleSave} className="bg-black text-white">
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium text-black text-lg leading-tight">{note.title}</h3>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <Button variant="ghost" size="sm" onClick={onEdit} className="h-6 w-6 p-0">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onDelete} className="h-6 w-6 p-0 text-red-500">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <p className="text-gray-600 flex-1 text-sm leading-relaxed line-clamp-6">{note.content}</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{note.updatedAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

// Todo List Card Component
const TodoListCard: React.FC<{
  todoList: TodoList;
  index: number;
  newTodoItem: string;
  setNewTodoItem: (value: string) => void;
  onAddItem: () => void;
  onToggleItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onDeleteList: () => void;
}> = ({ todoList, index, newTodoItem, setNewTodoItem, onAddItem, onToggleItem, onDeleteItem, onDeleteList }) => {
  const completedCount = todoList.items.filter(item => item.completed).length;
  const totalCount = todoList.items.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      layout
    >
      <Card className="p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 group">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-black text-lg">{todoList.title}</h3>
            <p className="text-sm text-gray-500">
              {completedCount} of {totalCount} completed
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDeleteList}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="w-full bg-gray-100 rounded-full h-1 mb-4">
            <div 
              className="bg-black h-1 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        )}

        {/* Todo items */}
        <div className="space-y-2 mb-4">
          {todoList.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 group/item">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleItem(item.id)}
                className="h-6 w-6 p-0"
              >
                {item.completed ? (
                  <CheckSquare className="w-4 h-4 text-black" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
              </Button>
              <span className={cn(
                "flex-1 text-sm",
                item.completed ? "line-through text-gray-400" : "text-black"
              )}>
                {item.text}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteItem(item.id)}
                className="opacity-0 group-hover/item:opacity-100 transition-opacity h-6 w-6 p-0 text-red-500"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add new item */}
        <div className="flex space-x-2">
          <Input
            placeholder="Add new task..."
            value={newTodoItem}
            onChange={(e) => setNewTodoItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onAddItem()}
            className="border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
          />
          <Button 
            onClick={onAddItem}
            disabled={!newTodoItem.trim()}
            size="sm"
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default EnhancedLibrary;